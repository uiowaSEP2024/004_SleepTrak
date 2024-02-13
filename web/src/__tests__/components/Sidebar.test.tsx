/**
 * @jest-environment jsdom
 */
// The doc above tells jest to use jsdom instead of node

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import '../../util/setupDomTests';
import Sidebar from '../../components/Sidebar';

describe('Sidebar Title and Night Mode Toggle Button', () => {
  test('renders sidebar with correct title', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    expect(screen.getByText('Camila Sleep')).toBeInTheDocument();
  });

  test('renders night mode toggle button', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const toggleButton = screen.getByTestId('color-toggle-button');

    expect(toggleButton).toBeInTheDocument();
  });
});
describe('Sidebar Navigation Links', () => {
  const links = [
    ['Dashboard', '/dashboard'],
    ['Clients', '/clients'],
    ['Babies', '/babies'],
    ['Messages', '/messages']
  ];

  test.each(links)(
    'renders sidebar with correct navigation text (%s)',
    (link) => {
      render(
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      );

      expect(screen.getByText(link)).toBeInTheDocument();
    }
  );

  test.each(links)(
    'clicking the %s link navigates to %s',
    (linkText, expectedPath) => {
      render(
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      );

      const link = screen.getByText(linkText);
      fireEvent.click(link);

      expect(window.location.pathname).toBe(expectedPath);
    }
  );
});
describe('Sidebar User Profile and Logout', () => {
  test('renders sidebar with user avatar', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    const avatar = screen.getByTestId('avatar');
    const username = screen.getByText(/mingi lee/i);
    const logoutButton = screen.getByTestId('logout-button');

    expect(avatar).toBeInTheDocument();
    expect(username).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });
  test('renders sidebar with username', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const username = screen.getByText(/mingi lee/i);
    expect(username).toBeInTheDocument();
  });
  test('renders sidebar with log-out button', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const logoutButton = screen.getByTestId('logout-button');
    expect(logoutButton).toBeInTheDocument();
  });
});
