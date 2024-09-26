import React from 'react';
import { render, screen } from '@testing-library/react';
import PermalinkedComment from '../PermalinkedComment';

// Mock the necessary dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock('../stores/CommentThreadStore', () => ({
  loadPermalinkedComment: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));

describe('PermalinkedComment Component', () => {
  const mockComment = {
    id: 1,
    by: 'testuser',
    time: Date.now() / 1000,
    text: 'This is a test comment',
    kids: [2, 3],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<PermalinkedComment params={{ id: '1' }} />);
    expect(screen.getByTestId('PermalinkedComment')).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    render(<PermalinkedComment params={{ id: '1' }} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays comment when loaded', () => {
    const CommentThreadStore = require('../stores/CommentThreadStore');
    CommentThreadStore.loadPermalinkedComment.mockImplementation((id, cb) => {
      cb(null, mockComment);
    });

    render(<PermalinkedComment params={{ id: '1' }} />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
  });

  test('displays error message when loading fails', () => {
    const CommentThreadStore = require('../stores/CommentThreadStore');
    CommentThreadStore.loadPermalinkedComment.mockImplementation((id, cb) => {
      cb(new Error('Failed to load comment'), null);
    });

    render(<PermalinkedComment params={{ id: '1' }} />);
    expect(screen.getByText('Error loading comment')).toBeInTheDocument();
  });

  test('calls loadPermalinkedComment with correct id', () => {
    const CommentThreadStore = require('../stores/CommentThreadStore');
    render(<PermalinkedComment params={{ id: '1' }} />);
    expect(CommentThreadStore.loadPermalinkedComment).toHaveBeenCalledWith('1', expect.any(Function));
  });

  test('adds and removes event listener', () => {
    const CommentThreadStore = require('../stores/CommentThreadStore');
    const { unmount } = render(<PermalinkedComment params={{ id: '1' }} />);
    expect(CommentThreadStore.addListener).toHaveBeenCalled();
    unmount();
    expect(CommentThreadStore.removeListener).toHaveBeenCalled();
  });

  test('updates component when store emits change', () => {
    const CommentThreadStore = require('../stores/CommentThreadStore');
    let changeListener;
    CommentThreadStore.addListener.mockImplementation((event, listener) => {
      if (event === 'change') {
        changeListener = listener;
      }
    });

    render(<PermalinkedComment params={{ id: '1' }} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    CommentThreadStore.loadPermalinkedComment.mockImplementation((id, cb) => {
      cb(null, mockComment);
    });
    changeListener();

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
  });
});
