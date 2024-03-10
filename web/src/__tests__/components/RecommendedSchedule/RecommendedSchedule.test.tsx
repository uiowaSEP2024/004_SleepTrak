import '@testing-library/jest-dom';
import '../../../util/setupDomTests';
import { render, screen } from '@testing-library/react';
import RecommendedSchedules from '../../../components/RecommendedSchedule/RecommendedSchedules';

// Mock ScheduleCreateButton, ScheduleDeleteButton, ScheduleEditRowButton, and ScheduleDeleteRowButton
jest.mock(
  '../../../components/RecommendedSchedule/ScheduleCreateButton',
  () => () => <button>Add Schedule</button>
);
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
  it('renders the recommended schedule with correct title and buttons', () => {
    render(<RecommendedSchedules />);

    expect(screen.getByText('Recommended Schedule')).toBeInTheDocument();
    expect(screen.getByText('Add Schedule')).toBeInTheDocument();
  });
});
