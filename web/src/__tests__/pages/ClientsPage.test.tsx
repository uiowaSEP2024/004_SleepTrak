import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { screen, act, render, waitFor } from '@testing-library/react';
import ClientsPage from '../../pages/ClientsPage';
import { BrowserRouter } from 'react-router-dom';
import API_URL from '../../util/apiURL';

// Mock fetch
const mockClientData = [
  {
    userId: '1',
    first_name: 'John',
    last_name: 'Doe',
    role: 'client',
    babies: [{ name: 'Baby1', babyId: '1' }]
  },
  {
    userId: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'admin',
    babies: []
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
      expect(global.fetch).toHaveBeenCalledWith(`http://${API_URL}/users/all`, {
        headers: {
          Authorization: 'Bearer mocked-access-token'
        }
      });
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
