/**
 * @jest-environment jsdom
 */
// The doc above tells jest to use jsdom instead of node

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import '../../util/setupDomTests';
import Sidebar from '../../components/Sidebar';
import { useAuth0 } from '@auth0/auth0-react';

jest.mock('@auth0/auth0-react');

// Mock user
const user = {
  email: 'johndoe@example.com',
  sub: 'auth0|1234567890'
};

let logoutMock: jest.Mock;

beforeEach(() => {
  logoutMock = jest.fn();

  // Mock the useAuth0 hook before each test
  (useAuth0 as jest.Mock).mockReturnValue({
    user,
    logout: logoutMock
    // Add any other functions or properties that your component uses from useAuth0
  });
});

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
    expect(avatar).toBeInTheDocument();
  });
  test('renders sidebar with username', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const username = screen.getByTestId('username');
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
  test('pressing log-out button calls auth0 logout function', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const logoutButton = screen.getByTestId('logout-button');
    logoutButton.click();

    expect(logoutMock).toHaveBeenCalled();
  });
});
