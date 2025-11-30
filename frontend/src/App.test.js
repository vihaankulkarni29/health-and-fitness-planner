import { render, screen } from '@testing-library/react';
import App from './App';

test('renders landing page by default', () => {
  render(<App />);
  const linkElement = screen.getByRole('heading', { level: 1, name: /Track Progress/i });
  expect(linkElement).toBeInTheDocument();
});
