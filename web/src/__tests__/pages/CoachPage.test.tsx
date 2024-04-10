import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { screen, render, waitFor } from '@testing-library/react';
import CoachPage from '../../pages/CoachPage';
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

const coachId = '3';
const route = `/coaches/${coachId}`;

beforeEach(() => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      json: () =>
        Promise.resolve(
          mockUserData.filter((object) => object.userId == coachId)
        )
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
    render(
      <Router initialEntries={[route]}>
        <Routes>
          <Route
            path="/coaches/:coachId"
            element={<CoachPage />}
          />
        </Routes>
      </Router>
    );
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://${API_URL}/users/${coachId}`,
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
    render(
      <Router initialEntries={[route]}>
        <Routes>
          <Route
            path="/coaches/:coachId"
            element={<CoachPage />}
          />
        </Routes>
      </Router>
    );
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      // The name of the coach in question is in the header but broken up
      expect(screen.queryByText('John Smith')).not.toBeInTheDocument();
      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
    });
  });
});
