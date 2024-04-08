import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { screen, act, render, waitFor } from '@testing-library/react';
import ClientsPage from '../../pages/ClientsPage';
import { BrowserRouter } from 'react-router-dom';
import API_URL from '../../util/apiURL';
import { UserWithBabies } from '../../types/schemaExtensions';

// Mock fetch
const mockClientData: UserWithBabies[] = [
  {
    userId: '1',
    coachId: '3',
    first_name: 'John',
    last_name: 'Doe',
    role: 'client',
    email: 'johndoe@test.com',
    babies: [
      {
        dob: new Date('2023-01-01'),
        babyId: '1',
        name: 'Baby A',
        parentId: '12345',
        weight: 8,
        medicine: ''
      }
    ]
  },
  {
    userId: '2',
    coachId: null,
    email: 'janesmith@test.com',
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'admin',
    babies: []
  }
];
global.fetch = jest.fn().mockResolvedValue({
  json: async () => mockClientData
});

// Mock environment variables
jest.mock('../../util/environment.ts', () => ({
  API_URL: 'localhost:3000',
  DOMAIN: 'auth0domain',
  CLIENT_ID: 'auth0clientid',
  AUDIENCE: 'test-test'
}));

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
