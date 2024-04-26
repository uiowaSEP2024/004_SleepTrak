import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { screen, render, waitFor } from '@testing-library/react';
import AssignPage from '../../pages/AssignPage';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import API_URL from '../../util/apiURL';
import { UserWithBabies } from '../../types/schemaExtensions';

// Mock fetch
const mockUserData: UserWithBabies[] = [
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
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'coach',
    email: 'janesmith@test.com',
    babies: []
  },
  {
    userId: '3',
    coachId: null,
    first_name: 'John',
    last_name: 'Smith',
    role: 'coach',
    email: 'johnsmith@test.com',
    babies: []
  },
  {
    userId: '4',
    coachId: null,
    first_name: 'Jane',
    last_name: 'Doe',
    role: 'client',
    email: 'janedoe@test.com',
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
        `${API_URL}/users/${clientId}`,
        {
          headers: {
            Authorization: 'Bearer mocked-access-token'
          }
        }
      );
      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/users/all`, {
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
      // The name of the client in question is in the header but not found since it is split up
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
    });
  });
});
