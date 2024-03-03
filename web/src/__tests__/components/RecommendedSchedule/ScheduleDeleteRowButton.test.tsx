import '@testing-library/jest-dom';
import '../../../util/setupDomTests';
import { render, fireEvent } from '@testing-library/react';
import ScheduleDeleteRowButton from '../../../components/RecommendedSchedule/ScheduleDeleteRowButton';

describe('ScheduleDeleteButton component', () => {
  it('renders the button with the correct text', () => {
    const { getByText } = render(<ScheduleDeleteRowButton />);
    expect(getByText('Delete')).toBeInTheDocument();
  });

  it('opens the dialog when "Delete" button is clicked', () => {
    const { getByText, getByRole } = render(<ScheduleDeleteRowButton />);
    fireEvent.click(getByText('Delete'));
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it('renders the dialog with the correct title', () => {
    const { getByText } = render(<ScheduleDeleteRowButton />);
    fireEvent.click(getByText('Delete'));
    expect(getByText('Delete this row?')).toBeInTheDocument();
  });

  it('renders the dialog with Yes and No', () => {
    const { getByText } = render(<ScheduleDeleteRowButton />);
    fireEvent.click(getByText('Delete'));
    expect(getByText('Yes')).toBeInTheDocument();
    expect(getByText('No')).toBeInTheDocument();
  });
});
