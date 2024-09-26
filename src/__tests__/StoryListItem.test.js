import React from 'react';
import { render, screen } from '@testing-library/react';
import StoryListItem from '../StoryListItem';

// Mock the necessary dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe('StoryListItem Component', () => {
  const mockStory = {
    id: 1,
    title: 'Test Story',
    score: 100,
    by: 'testuser',
    time: Date.now() / 1000,
    descendants: 10,
    url: 'https://example.com',
  };

  test('renders without crashing', () => {
    render(<StoryListItem story={mockStory} />);
    expect(screen.getByText('Test Story')).toBeInTheDocument();
  });

  test('displays correct story title', () => {
    render(<StoryListItem story={mockStory} />);
    expect(screen.getByText('Test Story')).toHaveAttribute('href', 'https://example.com');
  });

  test('displays correct score', () => {
    render(<StoryListItem story={mockStory} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('displays correct author', () => {
    render(<StoryListItem story={mockStory} />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  test('displays correct number of comments', () => {
    render(<StoryListItem story={mockStory} />);
    expect(screen.getByText('10 comments')).toBeInTheDocument();
  });

  test('displays "discuss" when there are no comments', () => {
    const storyWithNoComments = { ...mockStory, descendants: 0 };
    render(<StoryListItem story={storyWithNoComments} />);
    expect(screen.getByText('discuss')).toBeInTheDocument();
  });

  test('displays correct time ago', () => {
    const oneHourAgo = Date.now() / 1000 - 3600;
    const storyOneHourAgo = { ...mockStory, time: oneHourAgo };
    render(<StoryListItem story={storyOneHourAgo} />);
    expect(screen.getByText('1 hour ago')).toBeInTheDocument();
  });

  test('renders story without url', () => {
    const storyWithoutUrl = { ...mockStory, url: null };
    render(<StoryListItem story={storyWithoutUrl} />);
    expect(screen.getByText('Test Story')).toHaveAttribute('href', '/item/1');
  });

  test('applies correct CSS classes', () => {
    render(<StoryListItem story={mockStory} />);
    expect(screen.getByTestId('StoryListItem')).toHaveClass('StoryListItem');
    expect(screen.getByTestId('StoryListItem_title')).toHaveClass('StoryListItem__title');
    expect(screen.getByTestId('StoryListItem_meta')).toHaveClass('StoryListItem__meta');
  });
});
