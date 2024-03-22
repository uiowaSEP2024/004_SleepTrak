import '@testing-library/jest-dom';
import '../../../util/setupDomTests';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ScheduleDeleteButton from '../../../components/RecommendedSchedule/ScheduleDeleteButton';
import { Plan } from '../../../components/RecommendedSchedule/RecommendedSchedule';

const mockPlan: Plan = {
  planId: '1',
  clientId: '1',
  coachId: '1',
  reminders: [
    {
      reminderId: '1',
      planId: '1',
      description: 'Reminder 1',
      startTime: '2024-02-27T08:00:00.000Z',
      endTime: '2024-02-27T08:30:00.000Z'
    }
  ]
};

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
  const onSubmitMock = jest.fn();

  it('renders the button with the correct text', () => {
    const { getByText } = render(
      <ScheduleDeleteButton
        schedule={mockPlan}
        onSubmit={onSubmitMock}
      />
    );
    expect(getByText('Delete Schedule')).toBeInTheDocument();
  });

  it('opens the dialog when "Delete Schedule" button is clicked', () => {
    const { getByText, getByRole } = render(
      <ScheduleDeleteButton
        schedule={mockPlan}
        onSubmit={onSubmitMock}
      />
    );
    fireEvent.click(getByText('Delete Schedule'));
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it('renders the dialog with the correct title', () => {
    const { getByText } = render(
      <ScheduleDeleteButton
        schedule={mockPlan}
        onSubmit={onSubmitMock}
      />
    );
    fireEvent.click(getByText('Delete Schedule'));
    expect(getByText('Delete this schedule?')).toBeInTheDocument();
  });

  it('renders the dialog with Yes and No', () => {
    const { getByText } = render(
      <ScheduleDeleteButton
        schedule={mockPlan}
        onSubmit={onSubmitMock}
      />
    );
    fireEvent.click(getByText('Delete Schedule'));
    expect(getByText('Yes')).toBeInTheDocument();
    expect(getByText('No')).toBeInTheDocument();
  });

  it('submits the request to delete when click Yes button', async () => {
    const { getByText } = render(
      <ScheduleDeleteButton
        schedule={mockPlan}
        onSubmit={onSubmitMock}
      />
    );
    fireEvent.click(getByText('Delete Schedule'));
    fireEvent.click(getByText('Yes'));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:3000/plans/${mockPlan.planId}/delete`,
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
