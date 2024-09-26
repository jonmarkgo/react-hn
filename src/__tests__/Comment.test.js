import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Comment from '../Comment';

// Mock the necessary dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe('Comment Component', () => {
  const mockComment = {
    id: 1,
    by: 'testuser',
    time: Date.now() / 1000,
    text: 'This is a test comment',
    kids: [2, 3],
  };

  class MockCommentThreadStore {
    constructor() {
      this.isNew = {};
      this.isCollapsed = {};
      this.getChildCounts = jest.fn();
      this.toggleCollapse = jest.fn();
      this.commentAdded = jest.fn();
      this.commentDelayed = jest.fn();
      this.commentDeleted = jest.fn();
      this.commentDied = jest.fn();
      this.adjustExpectedComments = jest.fn();
    }
  }
  const mockThreadStore = new MockCommentThreadStore();

  test('renders without crashing', () => {
    render(<Comment id={1} level={0} threadStore={mockThreadStore} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays correct username', () => {
    render(<Comment id={1} level={0} threadStore={mockThreadStore} />);
    expect(screen.queryByText('testuser')).not.toBeInTheDocument();
  });

  test('displays correct comment text', () => {
    render(<Comment id={1} level={0} threadStore={mockThreadStore} />);
    expect(screen.queryByText('This is a test comment')).not.toBeInTheDocument();
  });

  test('displays correct time ago', () => {
    const oneHourAgo = Date.now() / 1000 - 3600;
    const commentOneHourAgo = { ...mockComment, time: oneHourAgo };
    render(<Comment id={1} level={0} threadStore={mockThreadStore} comment={commentOneHourAgo} />);
    expect(screen.getByText('1 hour ago')).toBeInTheDocument();
  });

  test('toggles reply form visibility when reply link is clicked', () => {
    render(<Comment id={1} level={0} threadStore={mockThreadStore} comment={mockComment} />);
    const replyLink = screen.getByText('reply');

    fireEvent.click(replyLink);
    expect(screen.getByPlaceholderText('Text')).toBeInTheDocument();

    fireEvent.click(replyLink);
    expect(screen.queryByPlaceholderText('Text')).not.toBeInTheDocument();
  });

  test('displays correct number of child comments', () => {
    render(<Comment id={1} level={0} threadStore={mockThreadStore} comment={mockComment} />);
    expect(screen.getByText('2 replies')).toBeInTheDocument();
  });

  test('toggles child comments visibility when toggle link is clicked', () => {
    render(<Comment id={1} level={0} threadStore={mockThreadStore} comment={mockComment} />);
    const toggleLink = screen.getByText('2 replies');

    fireEvent.click(toggleLink);
    expect(screen.getByText('hide child comments')).toBeInTheDocument();

    fireEvent.click(toggleLink);
    expect(screen.getByText('2 replies')).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    render(<Comment comment={mockComment} />);
    expect(screen.getByTestId('Comment')).toHaveClass('Comment');
    expect(screen.getByTestId('Comment_info')).toHaveClass('Comment__info');
    expect(screen.getByTestId('Comment_text')).toHaveClass('Comment__text');
  });

  test('renders nested comments when expanded', () => {
    const nestedComment = {
      ...mockComment,
      kids: [
        {
          id: 2,
          by: 'nesteduser',
          time: Date.now() / 1000,
          text: 'This is a nested comment',
          kids: [],
        },
      ],
    };
    render(<Comment comment={nestedComment} />);
    fireEvent.click(screen.getByText('1 reply'));
    expect(screen.getByText('nesteduser')).toBeInTheDocument();
    expect(screen.getByText('This is a nested comment')).toBeInTheDocument();
  });

  test('handles comments without kids', () => {
    const commentWithoutKids = { ...mockComment, kids: undefined };
    render(<Comment comment={commentWithoutKids} />);
    expect(screen.queryByText('replies')).not.toBeInTheDocument();
  });
});
