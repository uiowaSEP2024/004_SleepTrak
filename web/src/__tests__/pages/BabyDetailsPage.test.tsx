import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { screen, act, render, waitFor } from '@testing-library/react';
import BabyDetailsPage from '../../pages/BabyDetailsPage';
import BabyDropdown from '../../components/BabyDropdown';
import API_URL from '../../util/apiURL';
import { UserWithBabies } from '../../types/schemaExtensions';

// Mock Baby Dropdown Component
jest.mock('../../components/BabyDropdown');

// Mock Baby RecommendedSchedules Component
jest.mock('../../components/RecommendedSchedule/RecommendedSchedules');

// Mock environment variables
jest.mock('../../util/environment.ts', () => ({
  API_URL: 'localhost:3000',
  DOMAIN: 'auth0domain',
  CLIENT_ID: 'auth0clientid',
  AUDIENCE: 'test-test'
}));

// Mock API responses
const mockClientData: UserWithBabies = {
  userId: '2',
  coachId: '3',
  email: 'johndoe@test.com',
  role: 'client',
  first_name: 'John',
  last_name: 'Doe',
  babies: [
    {
      dob: new Date('2023-01-01'),
      babyId: '1',
      name: 'Baby A',
      parentId: '12345',
      weight: 8,
      medicine: ''
    },
    {
      dob: new Date('2023-02-15'),
      babyId: '2',
      name: 'Baby B',
      parentId: '12345',
      weight: 8,
      medicine: ''
    }
  ]
};

// Mock fetch
global.fetch = jest.fn().mockResolvedValue({
  json: async () => mockClientData
});

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ userId: mockClientData.userId })
}));

// Mock auth0
jest.mock('@auth0/auth0-react', () => ({
  ...jest.requireActual('@auth0/auth0-react'),
  useAuth0: jest.fn().mockReturnValue({
    isAuthenticated: true,
    getAccessTokenSilently: jest.fn().mockResolvedValue('mocked-access-token')
  })
}));

describe('BabyDetailsPage', () => {
  it('renders baby details correctly', async () => {
    act(() => {
      render(<BabyDetailsPage />);
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          mockClientData.first_name + ' ' + mockClientData.last_name
        )
      ).toBeInTheDocument();
    });
  });

  it('displays summary page by default correctly', async () => {
    act(() => {
      render(<BabyDetailsPage />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('summary-page')).toBeInTheDocument();
    });
  });

  it('fetches data correctly with params', async () => {
    act(() => {
      render(<BabyDetailsPage />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://${API_URL}/users/${mockClientData.userId}`,
        {
          headers: {
            Authorization: 'Bearer mocked-access-token'
          }
        }
      );
    });
  });

  it('passes props to baby dropdown component', async () => {
    act(() => {
      render(<BabyDetailsPage />);
    });

    await waitFor(() => {
      expect(BabyDropdown).toHaveBeenCalledWith(
        { babies: mockClientData.babies },
        {}
      );
    });
  });
});
