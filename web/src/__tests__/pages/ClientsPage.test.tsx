/**
 * @jest-environment jsdom
 */
// The doc above tells jest to use jsdom instead of node

import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { screen, act, render, waitFor } from '@testing-library/react';
import ClientsPage from '../../pages/ClientsPage';
import { BrowserRouter } from 'react-router-dom';

// Mock fetch
const mockClientData = [
  {
    userId: '1',
    first_name: 'John',
    last_name: 'Doe',
    role: 'client',
    Babies: [{ name: 'Baby1', babyId: '1' }]
  },
  {
    userId: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'admin',
    Babies: []
  }
];
global.fetch = jest.fn().mockResolvedValue({
  json: async () => mockClientData
});

// Mock auth0
jest.mock('@auth0/auth0-react', () => ({
  ...jest.requireActual('@auth0/auth0-react'),
  useAuth0: jest.fn().mockReturnValue({
    isAuthenticated: true,
    getAccessTokenSilently: jest.fn().mockResolvedValue('mocked-access-token')
  })
}));

describe('ClientsPage Component', () => {
  it('fetches data correctly', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <ClientsPage />
        </BrowserRouter>
      );
    });
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/users/all',
        {
          headers: {
            Authorization: 'Bearer mocked-access-token'
          }
        }
      );
    });
  });

  it('filters and renders clients only', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <ClientsPage />
        </BrowserRouter>
      );
    });
    await waitFor(() => {
      console.log(document.body.innerHTML);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('displays correct baby information', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <ClientsPage />
        </BrowserRouter>
      );
    });
    await waitFor(() => {
      expect(screen.getByText('Baby1')).toBeInTheDocument();
    });
  });
});
