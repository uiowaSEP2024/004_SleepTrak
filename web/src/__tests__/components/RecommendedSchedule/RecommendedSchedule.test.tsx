import '@testing-library/jest-dom';
import '../../../util/setupDomTests';
import { render, screen } from '@testing-library/react';
import RecommendedSchedule from '../../../components/RecommendedSchedule/RecommendedSchedule';

// Mock ScheduleCreateButton, ScheduleDeleteButton, ScheduleEditRowButton, and ScheduleDeleteRowButton

jest.mock(
  '../../../components/RecommendedSchedule/ScheduleDeleteButton',
  () => () => <button>Delete Schedule</button>
);
jest.mock(
  '../../../components/RecommendedSchedule/ScheduleEditRowButton',
  () => () => <button>Edit Row</button>
);
jest.mock(
  '../../../components/RecommendedSchedule/ScheduleDeleteRowButton',
  () => () => <button>Delete Row</button>
);

describe('RecommendedSchedule', () => {
  const sampleSchedule = {
    name: 'Schedule 1',
    schedule: {
      planId: 'sample-plan-id',
      clientId: 'sample-client-id',
      coachId: 'sample-coach-id',
      reminders: [
        {
          reminderId: '1',
          planId: 'sample-plan-id',
          description: 'Morning Rise',
          startTime: '06:30',
          endTime: null
        },
        {
          reminderId: '2',
          planId: 'sample-plan-id',
          description: 'Nap 1',
          startTime: '09:15',
          endTime: '10:45'
        },
        {
          reminderId: '3',
          planId: 'sample-plan-id',
          description: 'Asleep',
          startTime: '20:00',
          endTime: null
        }
      ]
    },
    onChange: jest.fn() // Mocked onChange function
  };

  it('renders the recommended schedule with correct title and buttons', () => {
    render(<RecommendedSchedule {...sampleSchedule} />);

    expect(screen.getByText('Schedule 1')).toBeInTheDocument();
    expect(screen.getByText('Delete Schedule')).toBeInTheDocument();
    expect(screen.getAllByText('Edit Row')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Delete Row')[0]).toBeInTheDocument();
  });

  it('renders the recommended schedule with correct schedule given props', () => {
    render(<RecommendedSchedule {...sampleSchedule} />);

    expect(screen.getByText('Morning Rise')).toBeInTheDocument();
    expect(screen.getByText('Nap 1')).toBeInTheDocument();
    expect(screen.getByText('Asleep')).toBeInTheDocument();
  });
});
