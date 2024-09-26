import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Paginator from '../Paginator';

describe('Paginator Component', () => {
  const mockOnPageChange = jest.fn();

  const defaultProps = {
    itemsPerPage: 30,
    totalItems: 100,
    currentPage: 1,
    onPageChange: mockOnPageChange,
    hasNext: true,
    route: 'news',
  };

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  test('renders without crashing', () => {
    render(<Paginator {...defaultProps} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('displays correct navigation links', () => {
    render(<Paginator {...defaultProps} />);
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  test('does not display Prev link on first page', () => {
    render(<Paginator {...defaultProps} />);
    expect(screen.queryByText('Prev')).not.toBeInTheDocument();
  });

  test('displays Prev link when not on first page', () => {
    render(<Paginator {...defaultProps} page={2} />);
    expect(screen.getByText('Prev')).toBeInTheDocument();
  });

  test('does not display More link on last page', () => {
    render(<Paginator {...defaultProps} hasNext={false} />);
    expect(screen.queryByText('More')).not.toBeInTheDocument();
  });

  test('displays More link when not on last page', () => {
    render(<Paginator {...defaultProps} />);
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  test('calls onPageChange when Prev link is clicked', () => {
    render(<Paginator {...defaultProps} page={2} />);
    fireEvent.click(screen.getByText('Prev'));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  test('calls onPageChange when More link is clicked', () => {
    render(<Paginator {...defaultProps} />);
    fireEvent.click(screen.getByText('More'));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });
});
