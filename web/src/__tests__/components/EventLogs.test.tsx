import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import EventLogs from '../../components/EventLogs';
import { act, render, waitFor } from '@testing-library/react';
import API_URL from '../../util/apiURL';

// Mock auth0
jest.mock('@auth0/auth0-react', () => ({
  ...jest.requireActual('@auth0/auth0-react'),
  useAuth0: jest.fn().mockReturnValue({
    isAuthenticated: true,
    getAccessTokenSilently: jest.fn().mockResolvedValue('mocked-access-token')
  })
}));

// Mock environment variables
jest.mock('../../util/environment.ts', () => ({
  API_URL: 'localhost:3000',
  DOMAIN: 'auth0domain',
  CLIENT_ID: 'auth0clientid',
  AUDIENCE: 'test-test'
}));

const mockEvents = [
  {
    eventId: '1',
    ownerId: '1',
    startTime: '2022-01-01T12:00:00.000Z',
    endTime: '2022-01-01T13:00:00.000Z',
    type: 'nap',
    amount: null,
    foodType: null,
    unit: null,
    note: 'the baby slept well',
    medicineType: null
  },
  {
    eventId: '2',
    ownerId: '2',
    startTime: '2023-01-01T12:00:00.000Z',
    endTime: '2023-01-01T13:00:00.000Z',
    type: 'sleep',
    amount: null,
    foodType: null,
    unit: null,
    note: null,
    medicineType: null
  },
  {
    eventId: '3',
    ownerId: '3',
    startTime: '2023-01-01T12:00:00.000Z',
    endTime: '2023-01-01T13:00:00.000Z',
    type: 'feed',
    amount: 15,
    foodType: 'milk',
    unit: 'oz',
    note: null,
    medicineType: null
  },
  {
    eventId: '4',
    ownerId: '4',
    startTime: '2023-01-01T12:00:00.000Z',
    endTime: '2023-01-01T13:00:00.000Z',
    type: 'medicine',
    amount: 2,
    foodType: null,
    unit: 'oz',
    note: null,
    medicineType: 'medicine'
  }
];

// Mock the fetch function
global.fetch = jest.fn().mockResolvedValue({
  json: () => Promise.resolve(mockEvents)
});

// Mock useParams
const useParamsMock = jest.fn().mockReturnValue({ userId: '1' });

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => useParamsMock()
}));

// Mock searchParams
const searchParams = {
  ownerId: '1'
};

describe('EventLogs Component', () => {
  it('fetches and renders Events List', async () => {
    const { getByText } = render(<EventLogs />);

    // Wait for the fetch function to be called
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Check if the events are rendered
    mockEvents.forEach((event) => {
      expect(getByText(event.type)).toBeInTheDocument();
    });
  });

  it('fetches data correctly with params', async () => {
    act(() => {
      render(<EventLogs />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/events/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mocked-access-token'
        },
        body: JSON.stringify(searchParams)
      });
    });
  });
});
