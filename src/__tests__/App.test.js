import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock the necessary dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/'
  }),
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('renders header with correct title', () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveTextContent('React HN');
  });

  test('renders navigation links', () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    expect(screen.getByText('new')).toBeInTheDocument();
    expect(screen.getByText('show')).toBeInTheDocument();
    expect(screen.getByText('ask')).toBeInTheDocument();
    expect(screen.getByText('jobs')).toBeInTheDocument();
  });

  test('renders footer with correct text', () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
    expect(footerElement).toHaveTextContent('react-hn');
  });

  // Add more tests as needed based on the App component's functionality
});
