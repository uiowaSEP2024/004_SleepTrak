import '@testing-library/jest-dom';
import '../../../util/setupDomTests';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ScheduleDeleteRowButton from '../../../components/RecommendedSchedule/ScheduleDeleteRowButton';
import { Reminder } from '../../../components/RecommendedSchedule/RecommendedSchedule';

const mockReminder: Reminder = {
  reminderId: '1',
  planId: '1',
  description: 'Reminder 1',
  startTime: '2024-02-27T08:00:00.000Z',
  endTime: '2024-02-27T08:30:00.000Z'
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
        `http://localhost:3000/reminders/${mockReminder.reminderId}/delete`,
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
