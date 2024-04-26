import '@testing-library/jest-dom';
import '../../../util/setupDomTests';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ScheduleCreateButton, {
  WakeWindowInputField
} from '../../../components/RecommendedSchedule/ScheduleCreateButton';
import dayjs from 'dayjs';
import { createSleepPlan } from '../../../util/utils';
import { API_URL } from '../../../util/environment';

// Mock the TimePickerField component
jest.mock('../../../components/TimePickerField', () => () => (
  <div data-testid="mocked-time-picker">Mocked TimePickerField</div>
));

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

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ userId: '1', babyId: '1' })
}));

const MockRecommendedPlan = {
  ageInMonth: '1M',
  numOfNaps: 5,
  wakeWindow: 3
};

describe('ScheduleCreateButton', () => {
  it('renders the create schedule dialog with correct elements', () => {
    const { getByText } = render(<ScheduleCreateButton onSubmit={jest.fn()} />);

    global.fetch = jest.fn().mockResolvedValue({
      json: async () => MockRecommendedPlan
    });

    fireEvent.click(getByText('Add Schedule'));

    expect(getByText('Create a new schedule')).toBeInTheDocument();
    expect(getByText('Number of Naps')).toBeInTheDocument();
    expect(getByText('Wake Windows (Hours Between Sleep)')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
    expect(getByText('Create')).toBeInTheDocument();
  });

  it('fetches default recommended schedule when creating schedule', async () => {
    const { getByText } = render(<ScheduleCreateButton onSubmit={jest.fn()} />);

    global.fetch = jest.fn().mockResolvedValue({
      json: async () => MockRecommendedPlan
    });

    fireEvent.click(getByText('Add Schedule'));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}/recommended_plans/1`,
        {
          headers: {
            Authorization: `Bearer mocked-access-token`
          }
        }
      );
    });
  });

  it('submits the form correctly when click create button', async () => {
    // Mock the createSleepPlan function for this test
    const mockPlan = {
      // planId: '1',
      clientId: '1',
      coachId: '1',
      reminders: [
        {
          reminderId: '1',
          planId: '1',
          description: 'Reminder 1',
          startTime: new Date('2024-02-27T08:00:00.000Z'),
          endTime: new Date('2024-02-27T08:30:00.000Z')
        }
      ]
    };

    const utilsModule = await import('../../../util/utils');

    const spyCreateSleepPlan = jest
      .spyOn(utilsModule, 'createSleepPlan')
      .mockReturnValue(mockPlan);

    const { getByText } = render(<ScheduleCreateButton onSubmit={jest.fn()} />);

    global.fetch = jest.fn().mockResolvedValue({
      json: async () => MockRecommendedPlan
    });

    await fireEvent.click(getByText('Add Schedule'));

    global.fetch = jest.fn(); // Mock the global fetch again for creating schedule

    await fireEvent.click(getByText('Create'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/plans/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer mocked-access-token`
        },
        body: JSON.stringify(mockPlan)
      });
    });

    spyCreateSleepPlan.mockRestore();
  });
});

describe('WakeWindowInputField', () => {
  it('renders with correct label and default value', () => {
    const index = 0;
    const label = 'Wake Window';
    const wakeWindows = [2, 3, 4];
    const onChange = jest.fn();

    const { getByLabelText } = render(
      <WakeWindowInputField
        index={index}
        label={label}
        wakeWindows={wakeWindows}
        onChange={onChange}
      />
    );

    const input = getByLabelText(label) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('number');
    expect(input.value).toBe('2');
  });

  it('calls onChange with updated wakeWindows when input value changes', () => {
    const index = 1;
    const label = 'Wake Window';
    const wakeWindows = [2, 3, 4];
    const onChange = jest.fn();

    const { getByLabelText } = render(
      <WakeWindowInputField
        index={index}
        label={label}
        wakeWindows={wakeWindows}
        onChange={onChange}
      />
    );

    const input = getByLabelText(label) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '5' } });

    expect(onChange).toHaveBeenCalledWith([2, 5, 4]);
  });
});

describe('createSleepPlan', () => {
  it('generates plan data with valid input parameters', () => {
    const wakeUpTime = dayjs('2023-01-01T14:00:00.000Z');
    const earliestGetReadyTime = dayjs('2023-01-02T01:30:00.000Z');
    const desiredBedTime = dayjs('2023-01-02T02:00:00.000Z');
    const wakeWindows = [3, 3, 3];
    const numOfNaps = 2;
    const userId = '123';
    const user = { sub: '456' };

    const planData = createSleepPlan(
      wakeUpTime,
      earliestGetReadyTime,
      desiredBedTime,
      wakeWindows,
      numOfNaps,
      userId,
      user
    );

    const expectedReminders = [
      {
        description: 'Morning Rise',
        startTime: '2023-01-01T14:00:00.000Z'
      },
      {
        description: 'Nap 1',
        startTime: '2023-01-01T17:00:00.000Z',
        endTime: '2023-01-01T18:30:00.000Z'
      },
      {
        description: 'Nap 2',
        startTime: '2023-01-01T21:30:00.000Z',
        endTime: '2023-01-01T23:00:00.000Z'
      },
      {
        description: 'Get Ready for bed',
        startTime: '2023-01-02T01:30:00.000Z'
      },
      {
        description: 'Asleep ',
        startTime: '2023-01-02T02:00:00.000Z'
      }
    ];

    // Convert objects to JSON strings for comparison
    const planDataString = JSON.stringify(planData.reminders);
    const expectedRemindersString = JSON.stringify(expectedReminders);

    expect(planDataString).toEqual(expectedRemindersString);
  });
});
