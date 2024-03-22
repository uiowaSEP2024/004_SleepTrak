import '@testing-library/jest-dom';
import '../../../util/setupDomTests';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ScheduleEditRowButton from '../../../components/RecommendedSchedule/ScheduleEditRowButton';
import { Reminder } from '../../../components/RecommendedSchedule/RecommendedSchedule';

// Mock the TimePickerField component
jest.mock('../../../components/TimePickerField', () => () => (
  <div data-testid="mocked-time-picker">Mocked TimePickerField</div>
));

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

describe('ScheduleEditButton component', () => {
  it('renders the button with the correct text', () => {
    const { getByText } = render(
      <ScheduleEditRowButton
        reminder={mockReminder}
        onSubmit={onSubmitMock}
      />
    );
    expect(getByText('Edit')).toBeInTheDocument();
  });

  it('opens the dialog when "Edit" button is clicked', () => {
    const { getByText, getByRole } = render(
      <ScheduleEditRowButton
        reminder={mockReminder}
        onSubmit={onSubmitMock}
      />
    );
    fireEvent.click(getByText('Edit'));
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it('displays the end time field by default', () => {
    const { getByText, getAllByTestId } = render(
      <ScheduleEditRowButton
        reminder={mockReminder}
        onSubmit={onSubmitMock}
      />
    );
    fireEvent.click(getByText('Edit'));
    const components = getAllByTestId('mocked-time-picker');
    expect(components.length).toBe(2);
  });

  it('hides the end time field when "Has End Time" checkbox is unchecked', () => {
    const { getByText, getByLabelText, getAllByTestId } = render(
      <ScheduleEditRowButton
        reminder={mockReminder}
        onSubmit={onSubmitMock}
      />
    );
    fireEvent.click(getByText('Edit'));
    fireEvent.click(getByLabelText('Has End Time'));
    const components = getAllByTestId('mocked-time-picker');
    expect(components.length).toBe(1);
  });

  it('renders the dialog with Submit button', () => {
    const { getByText, getByLabelText } = render(
      <ScheduleEditRowButton
        reminder={mockReminder}
        onSubmit={onSubmitMock}
      />
    );
    fireEvent.click(getByText('Edit'));
    expect(getByText('Cancel')).toBeInTheDocument();
    const submitButton = getByLabelText('edit-row-submit');
    expect(submitButton).toBeInTheDocument();
  });

  it('renders the dialog with reminder given as props', () => {
    const { getByDisplayValue, getByText } = render(
      <ScheduleEditRowButton
        reminder={mockReminder}
        onSubmit={onSubmitMock}
      />
    );
    fireEvent.click(getByText('Edit'));
    expect(getByDisplayValue('Reminder 1')).toBeInTheDocument();
  });

  it('submits the form correctly', async () => {
    const { getByText, getByLabelText } = render(
      <ScheduleEditRowButton
        reminder={mockReminder}
        onSubmit={onSubmitMock}
      />
    );
    fireEvent.click(getByText('Edit'));
    const submitButton = getByLabelText('edit-row-submit');
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:3000/reminders/${mockReminder.reminderId}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer mocked-access-token`
          },
          body: JSON.stringify({
            description: mockReminder.description,
            startTime: mockReminder.startTime,
            endTime: mockReminder.endTime
          })
        }
      );
    });
  });
});
