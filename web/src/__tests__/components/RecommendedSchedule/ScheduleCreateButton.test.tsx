import '@testing-library/jest-dom';
import '../../../util/setupDomTests';
import { render, fireEvent, screen } from '@testing-library/react';
import ScheduleCreateButton from '../../../components/RecommendedSchedule/ScheduleCreateButton';

// Mock the TimePickerField component
jest.mock('../../../components/TimePickerField', () => () => (
  <div data-testid="mocked-time-picker">Mocked TimePickerField</div>
));

describe('ScheduleCreateButton', () => {
  it('renders the create schedule dialog with correct elements', () => {
    render(<ScheduleCreateButton />);

    fireEvent.click(screen.getByText('Add Schedule'));

    expect(screen.getByText('Create a new schedule')).toBeInTheDocument();
    expect(screen.getByText('Number of Naps')).toBeInTheDocument();
    expect(screen.getByText('Wake Windows')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });
});
