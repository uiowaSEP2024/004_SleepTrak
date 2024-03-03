import '@testing-library/jest-dom';
import '../../../util/setupDomTests';
import { render, fireEvent } from '@testing-library/react';
import ScheduleDeleteButton from '../../../components/RecommendedSchedule/ScheduleDeleteButton';

describe('ScheduleDeleteButton component', () => {
  it('renders the button with the correct text', () => {
    const { getByText } = render(<ScheduleDeleteButton />);
    expect(getByText('Delete Schedule')).toBeInTheDocument();
  });

  it('opens the dialog when "Delete Schedule" button is clicked', () => {
    const { getByText, getByRole } = render(<ScheduleDeleteButton />);
    fireEvent.click(getByText('Delete Schedule'));
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it('renders the dialog with the correct title', () => {
    const { getByText } = render(<ScheduleDeleteButton />);
    fireEvent.click(getByText('Delete Schedule'));
    expect(getByText('Delete this schedule?')).toBeInTheDocument();
  });

  it('renders the dialog with Yes and No', () => {
    const { getByText } = render(<ScheduleDeleteButton />);
    fireEvent.click(getByText('Delete Schedule'));
    expect(getByText('Yes')).toBeInTheDocument();
    expect(getByText('No')).toBeInTheDocument();
  });
});
