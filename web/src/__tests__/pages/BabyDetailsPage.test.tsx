import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { screen, act, render, waitFor } from '@testing-library/react';
import BabyDetailsPage from '../../pages/BabyDetailsPage';
import BabyDropdown from '../../components/BabyDropdown';
import API_URL from '../../util/apiURL';

// Mock Baby Dropdown Component
jest.mock('../../components/BabyDropdown');

// Mock Baby RecommendedSchedules Component
jest.mock('../../components/RecommendedSchedule/RecommendedSchedules');

// Mock API responses
const mockClientData = {
  id: '2',
  first_name: 'John',
  last_name: 'Doe',
  babies: [
    {
      dob: '2023-01-01',
      babyId: '1',
      name: 'Baby A',
      parentId: '12345'
    },
    {
      dob: '2023-02-15',
      babyId: '2',
      name: 'Baby B',
      parentId: '12345'
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
  useParams: jest.fn().mockReturnValue({ userId: '1' })
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
      expect(screen.getByText('John Doe')).toBeInTheDocument();
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
      expect(global.fetch).toHaveBeenCalledWith(`http://${API_URL}/babies/1`, {
        headers: {
          Authorization: 'Bearer mocked-access-token'
        }
      });
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
