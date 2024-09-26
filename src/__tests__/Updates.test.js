import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Updates from '../Updates';

// Mock the necessary dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock('../stores/UpdatesStore', () => ({
  getUpdates: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));

describe('Updates Component', () => {
  const mockUpdates = {
    comments: [
      { id: 1, by: 'user1', time: Date.now() / 1000, text: 'Comment 1' },
      { id: 2, by: 'user2', time: Date.now() / 1000, text: 'Comment 2' },
    ],
    stories: [
      { id: 3, by: 'user3', time: Date.now() / 1000, title: 'Story 1' },
      { id: 4, by: 'user4', time: Date.now() / 1000, title: 'Story 2' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<Updates />);
    expect(screen.getByTestId('Updates')).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    render(<Updates />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays updates when loaded', () => {
    const UpdatesStore = require('../stores/UpdatesStore');
    UpdatesStore.getUpdates.mockReturnValue(mockUpdates);

    render(<Updates />);

    expect(screen.getByText('New Comments')).toBeInTheDocument();
    expect(screen.getByText('New Stories')).toBeInTheDocument();
    expect(screen.getByText('Comment 1')).toBeInTheDocument();
    expect(screen.getByText('Comment 2')).toBeInTheDocument();
    expect(screen.getByText('Story 1')).toBeInTheDocument();
    expect(screen.getByText('Story 2')).toBeInTheDocument();
  });

  test('adds and removes event listener', () => {
    const UpdatesStore = require('../stores/UpdatesStore');
    const { unmount } = render(<Updates />);
    expect(UpdatesStore.addListener).toHaveBeenCalled();
    unmount();
    expect(UpdatesStore.removeListener).toHaveBeenCalled();
  });

  test('updates component when store emits change', () => {
    const UpdatesStore = require('../stores/UpdatesStore');
    let changeListener;
    UpdatesStore.addListener.mockImplementation((event, listener) => {
      if (event === 'change') {
        changeListener = listener;
      }
    });

    UpdatesStore.getUpdates.mockReturnValue({});
    render(<Updates />);
    expect(screen.getByText('No new updates')).toBeInTheDocument();

    UpdatesStore.getUpdates.mockReturnValue(mockUpdates);
    act(() => {
      changeListener();
    });

    expect(screen.getByText('New Comments')).toBeInTheDocument();
    expect(screen.getByText('New Stories')).toBeInTheDocument();
  });

  test('displays "No new updates" when there are no updates', () => {
    const UpdatesStore = require('../stores/UpdatesStore');
    UpdatesStore.getUpdates.mockReturnValue({});

    render(<Updates />);
    expect(screen.getByText('No new updates')).toBeInTheDocument();
  });

  test('displays correct number of updates', () => {
    const UpdatesStore = require('../stores/UpdatesStore');
    UpdatesStore.getUpdates.mockReturnValue(mockUpdates);

    render(<Updates />);
    expect(screen.getByText('2 new comments')).toBeInTheDocument();
    expect(screen.getByText('2 new stories')).toBeInTheDocument();
  });

  test('displays user links correctly', () => {
    const UpdatesStore = require('../stores/UpdatesStore');
    UpdatesStore.getUpdates.mockReturnValue(mockUpdates);

    render(<Updates />);
    expect(screen.getByText('user1')).toHaveAttribute('href', '/user/user1');
    expect(screen.getByText('user2')).toHaveAttribute('href', '/user/user2');
    expect(screen.getByText('user3')).toHaveAttribute('href', '/user/user3');
    expect(screen.getByText('user4')).toHaveAttribute('href', '/user/user4');
  });

  test('displays correct time ago', () => {
    const UpdatesStore = require('../stores/UpdatesStore');
    const oneHourAgo = Date.now() / 1000 - 3600;
    const updatesOneHourAgo = {
      comments: [{ ...mockUpdates.comments[0], time: oneHourAgo }],
      stories: [{ ...mockUpdates.stories[0], time: oneHourAgo }],
    };
    UpdatesStore.getUpdates.mockReturnValue(updatesOneHourAgo);

    render(<Updates />);
    expect(screen.getAllByText('1 hour ago')).toHaveLength(2);
  });
});
