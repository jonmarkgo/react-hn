import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import UserProfile from '../UserProfile';
import HNService from '../services/HNService';

// Mock the necessary dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock('../services/HNService', () => ({
  userRef: jest.fn(),
}));

describe('UserProfile Component', () => {
  const mockUser = {
    id: 'testuser',
    created: Date.now() / 1000,
    karma: 100,
    about: 'This is a test user',
    delay: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', async () => {
    HNService.userRef.mockReturnValue({
      on: jest.fn((event, callback) => {
        if (event === 'value') {
          callback({
            val: () => mockUser
          });
        }
      }),
      off: jest.fn(),
    });
    render(<UserProfile params={{ id: 'testuser' }} />);
    await waitFor(() => {
      expect(screen.getByTestId('UserProfile')).toBeInTheDocument();
    });
  });

  test('displays loading state initially', async () => {
    HNService.userRef.mockReturnValue({
      on: jest.fn(),
      off: jest.fn(),
    });
    render(<UserProfile params={{ id: 'testuser' }} />);
    expect(screen.getByTestId('UserProfile')).toHaveClass('UserProfile--loading');
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'testuser' })).toBeInTheDocument();
  });

  test('displays user information when loaded', async () => {
    HNService.userRef.mockReturnValue({
      on: jest.fn((event, callback) => {
        if (event === 'value') {
          callback({
            val: () => mockUser
          });
        }
      }),
      off: jest.fn(),
    });

    render(<UserProfile params={{ id: 'testuser' }} />);

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('This is a test user')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  test('displays error message when loading fails', async () => {
    HNService.userRef.mockReturnValue({
      on: jest.fn((event, callback, errorCallback) => {
        if (event === 'value') {
          errorCallback(new Error('Failed to load user'));
        }
      }),
      off: jest.fn(),
    });

    render(<UserProfile params={{ id: 'testuser' }} />);

    await waitFor(() => {
      expect(screen.getByText('Error loading user profile')).toBeInTheDocument();
      expect(screen.getByText('Failed to load user')).toBeInTheDocument();
    });
  });

  test('calls userRef with correct id', () => {
    HNService.userRef.mockReturnValue({
      on: jest.fn(),
      off: jest.fn(),
    });
    render(<UserProfile params={{ id: 'testuser' }} />);
    expect(HNService.userRef).toHaveBeenCalledWith('testuser');
  });

  test('adds and removes event listener', () => {
    const mockOn = jest.fn();
    const mockOff = jest.fn();
    HNService.userRef.mockReturnValue({
      on: mockOn,
      off: mockOff,
    });
    const { unmount } = render(<UserProfile params={{ id: 'testuser' }} />);
    expect(mockOn).toHaveBeenCalledWith('value', expect.any(Function), expect.any(Function));
    unmount();
    expect(mockOff).toHaveBeenCalled();
  });

  test('updates component when data changes', async () => {
    let valueCallback;
    HNService.userRef.mockReturnValue({
      on: jest.fn((event, callback) => {
        if (event === 'value') {
          valueCallback = callback;
        }
      }),
      off: jest.fn(),
    });

    render(<UserProfile params={{ id: 'testuser' }} />);
    expect(screen.getByTestId('UserProfile')).toHaveClass('UserProfile--loading');

    act(() => {
      valueCallback({
        val: () => mockUser
      });
    });

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  test('displays correct creation date', async () => {
    const oneYearAgo = Date.now() / 1000 - 365 * 24 * 60 * 60;
    const userOneYearAgo = { ...mockUser, created: oneYearAgo };
    HNService.userRef.mockReturnValue({
      on: jest.fn((event, callback) => {
        if (event === 'value') {
          callback({
            val: () => userOneYearAgo
          });
        }
      }),
      off: jest.fn(),
    });

    render(<UserProfile params={{ id: 'testuser' }} />);
    await waitFor(() => {
      expect(screen.getByText(/1 year ago/)).toBeInTheDocument();
    });
  });

  test('displays correct delay', async () => {
    HNService.userRef.mockReturnValue({
      on: jest.fn((event, callback) => {
        if (event === 'value') {
          callback({
            val: () => mockUser
          });
        }
      }),
      off: jest.fn(),
    });

    render(<UserProfile params={{ id: 'testuser' }} />);
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  test('renders user about HTML safely', async () => {
    const userWithHtmlAbout = { ...mockUser, about: '<p>About with <strong>HTML</strong></p>' };
    HNService.userRef.mockReturnValue({
      on: jest.fn((event, callback) => {
        if (event === 'value') {
          callback({
            val: () => userWithHtmlAbout
          });
        }
      }),
      off: jest.fn(),
    });

    render(<UserProfile params={{ id: 'testuser' }} />);
    await waitFor(() => {
      const aboutElement = screen.getByText(/About with HTML/);
      expect(aboutElement).toContainHTML('<p>About with <strong>HTML</strong></p>');
    });
  });
});
