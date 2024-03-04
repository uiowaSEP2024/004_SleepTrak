import '@testing-library/jest-dom';
import '../../../util/setupDomTests';
import { render, fireEvent } from '@testing-library/react';
import ScheduleEditRowButton from '../../../components/RecommendedSchedule/ScheduleEditRowButton';

// Mock the TimePickerField component
jest.mock('../../../components/TimePickerField', () => () => (
  <div data-testid="mocked-time-picker">Mocked TimePickerField</div>
));

describe('ScheduleEditButton component', () => {
  it('renders the button with the correct text', () => {
    const { getByText } = render(<ScheduleEditRowButton />);
    expect(getByText('Edit')).toBeInTheDocument();
  });

  it('opens the dialog when "Edit" button is clicked', () => {
    const { getByText, getByRole } = render(<ScheduleEditRowButton />);
    fireEvent.click(getByText('Edit'));
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it('displays the end time field by default', () => {
    const { getByText, getAllByTestId } = render(<ScheduleEditRowButton />);
    fireEvent.click(getByText('Edit'));
    const components = getAllByTestId('mocked-time-picker');
    expect(components.length).toBe(2);
  });

  it('hides the end time field when "Has End Time" checkbox is unchecked', () => {
    const { getByText, getByLabelText, getAllByTestId } = render(
      <ScheduleEditRowButton />
    );
    fireEvent.click(getByText('Edit'));
    fireEvent.click(getByLabelText('Has End Time'));
    const components = getAllByTestId('mocked-time-picker');
    expect(components.length).toBe(1);
  });

  it('renders the dialog with Yes and No', () => {
    const { getByText, getByRole } = render(<ScheduleEditRowButton />);
    fireEvent.click(getByText('Edit'));
    expect(getByText('Cancel')).toBeInTheDocument();
    const editButton = getByRole('button', { name: 'Edit' });
    const submitButton = editButton.closest('button[type="submit"]');
    expect(submitButton).toBeInTheDocument();
  });
});
