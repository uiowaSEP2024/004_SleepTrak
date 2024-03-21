import '@testing-library/jest-dom';
import '../../../util/setupDomTests';
import { render, waitFor } from '@testing-library/react';
import RecommendedSchedules from '../../../components/RecommendedSchedule/RecommendedSchedules';

// Mock auth0
jest.mock('@auth0/auth0-react', () => ({
  ...jest.requireActual('@auth0/auth0-react'),
  useAuth0: jest.fn().mockReturnValue({
    isAuthenticated: true,
    getAccessTokenSilently: jest.fn().mockResolvedValue('mocked-access-token')
  })
}));

// Mock the RecommendedSchedule component
jest.mock('../../../components/RecommendedSchedule/RecommendedSchedule', () => {
  return jest.fn().mockImplementation(({ name }) => {
    return <div data-testid={`recommended-schedule-${name}`}>{name}</div>;
  });
});

// Mock the RecommendedSchedule component
jest.mock(
  '../../../components/RecommendedSchedule/ScheduleCreateButton',
  () => {
    return jest.fn().mockImplementation(() => {
      return (
        <div data-testid={`recommended-create-button}`}>
          Mocked Recommended Schedule Create Button
        </div>
      );
    });
  }
);

describe('RecommendedSchedules', () => {
  it('fetches and renders recommended schedules', async () => {
    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve([{ name: 'Schedule 1' }, { name: 'Schedule 2' }])
    });

    const { getByText } = render(<RecommendedSchedules />);

    // Wait for the fetch function to be called
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Check if the recommended schedules are rendered
    expect(getByText('Recommended Schedule')).toBeInTheDocument();
    expect(getByText('Schedule 1')).toBeInTheDocument();
    expect(getByText('Schedule 2')).toBeInTheDocument();
  });

  it('renders a message if no recommended schedules are found', async () => {
    // Mock the fetch function to return an empty array
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve([])
    });

    const { getByText } = render(<RecommendedSchedules />);

    // Wait for the fetch function to be called
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Check if the message is rendered
    expect(
      getByText('This Client Does Not Have a Recommended Schuedule Yet.')
    ).toBeInTheDocument();
  });
});
