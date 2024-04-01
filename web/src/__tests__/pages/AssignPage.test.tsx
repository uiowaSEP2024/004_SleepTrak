import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { screen, render, waitFor } from '@testing-library/react';
import AssignPage from '../../pages/AssignPage';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import API_URL from '../../util/apiURL';

// Mock fetch
const mockUserData = [
  {
    userId: '1',
    coachId: '3',
    first_name: 'John',
    last_name: 'Doe',
    role: 'client',
    babies: [{ name: 'Baby1', babyId: '1' }]
  },
  {
    userId: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'coach',
    clients: []
  },
  {
    userId: '3',
    first_name: 'John',
    last_name: 'Smith',
    role: 'coach',
    clients: ['1']
  },
  {
    userId: '4',
    first_name: 'Jane',
    last_name: 'Doe',
    role: 'client',
    babies: [{ name: 'Baby1', babyId: '1' }]
  }
];

beforeEach(() => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      json: () => Promise.resolve(mockUserData[0])
    })
    .mockResolvedValueOnce({
      json: () => Promise.resolve(mockUserData)
    });
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

describe('AssignPage Component', () => {
  it('fetches data correctly', async () => {
    const clientId = '1';
    const route = `/clients/${clientId}/assign`;
    render(
      <Router initialEntries={[route]}>
        <Routes>
          <Route
            path="/clients/:clientId/assign"
            element={<AssignPage />}
          />
        </Routes>
      </Router>
    );
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://${API_URL}/users/${clientId}`,
        {
          headers: {
            Authorization: 'Bearer mocked-access-token'
          }
        }
      );
      expect(global.fetch).toHaveBeenCalledWith(`http://${API_URL}/users/all`, {
        headers: {
          Authorization: 'Bearer mocked-access-token'
        }
      });
    });
  });

  it('filters and renders coaches only', async () => {
    const clientId = '1';
    const route = `/clients/${clientId}/assign`;
    render(
      <Router initialEntries={[route]}>
        <Routes>
          <Route
            path="/clients/:clientId/assign"
            element={<AssignPage />}
          />
        </Routes>
      </Router>
    );
    await waitFor(() => {
      // The name of the client in question is in the header
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).not.toBeInTheDocument();
    });
  });
});
