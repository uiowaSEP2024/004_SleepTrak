import '@testing-library/jest-dom';
import '../../../util/setupDomTests';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ScheduleDeleteRowButton from '../../../components/RecommendedSchedule/ScheduleDeleteRowButton';
import { API_URL } from '../../../util/environment';

const mockReminder = {
  reminderId: '1',
  planId: '1',
  description: 'Reminder 1',
  startTime: new Date('2024-02-27T08:00:00.000Z'),
  endTime: new Date('2024-02-27T08:30:00.000Z')
};

const onSubmitMock = jest.fn();

// Mock auth0
jest.mock('@auth0/auth0-react', () => ({
  ...jest.requireActual('@auth0/auth0-react'),
  useAuth0: jest.fn().mockReturnValue({
    isAuthenticated: true,
    getAccessTokenSilently: jest.fn().mockResolvedValue('mocked-access-token')
  })
}));

// Mock environment variables
jest.mock('../../../util/environment.ts', () => ({
  API_URL: 'localhost:3000',
  DOMAIN: 'auth0domain',
  CLIENT_ID: 'auth0clientid',
  AUDIENCE: 'test-test'
}));

global.fetch = jest.fn();

describe('ScheduleDeleteButton component', () => {
  it('renders the button with the correct text', () => {
    const { getByText } = render(
      <ScheduleDeleteRowButton
        reminder={mockReminder}
        onSubmit={onSubmitMock}
      />
    );
    expect(getByText('Delete')).toBeInTheDocument();
  });

  it('opens the dialog when "Delete" button is clicked', () => {
    const { getByText, getByRole } = render(
      <ScheduleDeleteRowButton
        reminder={mockReminder}
        onSubmit={onSubmitMock}
      />
    );
    fireEvent.click(getByText('Delete'));
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it('renders the dialog with the correct title', () => {
    const { getByText } = render(
      <ScheduleDeleteRowButton
        reminder={mockReminder}
        onSubmit={onSubmitMock}
      />
    );
    fireEvent.click(getByText('Delete'));
    expect(getByText('Delete this row?')).toBeInTheDocument();
  });

  it('renders the dialog with Yes and No', () => {
    const { getByText } = render(
      <ScheduleDeleteRowButton
        reminder={mockReminder}
        onSubmit={onSubmitMock}
      />
    );
    fireEvent.click(getByText('Delete'));
    expect(getByText('Yes')).toBeInTheDocument();
    expect(getByText('No')).toBeInTheDocument();
  });

  it('submits the request to delete when click Yes button', async () => {
    const { getByText } = render(
      <ScheduleDeleteRowButton
        reminder={mockReminder}
        onSubmit={onSubmitMock}
      />
    );
    fireEvent.click(getByText('Delete'));
    fireEvent.click(getByText('Yes'));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/reminders/${mockReminder.reminderId}/delete`,
        {
          method: 'Delete',
          headers: {
            Authorization: `Bearer mocked-access-token`
          }
        }
      );
    });
  });
});
