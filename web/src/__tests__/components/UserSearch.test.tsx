import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { act, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import API_URL from '../../util/apiURL';
import UserSearch from '../../components/UserSearch';
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
global.fetch = jest.fn().mockResolvedValue({
  json: async () => mockUserData
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
    getAccessTokenSilently: jest.fn().mockResolvedValue('mocked-access-token'),
    user: {
      sub: 'mockUser'
    }
  })
}));

const onChange = jest.fn();

import { useAuth0 } from '@auth0/auth0-react';

describe('UserSearch Component', () => {
  it('fetchs an auth0 access token', async () => {
    const { getAccessTokenSilently } = useAuth0();
    act(() => {
      render(
        <BrowserRouter>
          <UserSearch onChange={onChange} />
        </BrowserRouter>
      );
    });
    await waitFor(() => {
      expect(getAccessTokenSilently).toHaveBeenCalled();
    });
  });
  it('fetchs all users', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <UserSearch onChange={onChange} />
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
  it('renders an Autocomplete component', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <UserSearch onChange={onChange} />
        </BrowserRouter>
      );
    });
    await waitFor(() => {
      const autocompleteElement = screen.getByRole('combobox');
      expect(autocompleteElement).toBeInTheDocument();
    });
  });
});
