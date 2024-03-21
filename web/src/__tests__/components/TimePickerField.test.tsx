import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { fireEvent, render } from '@testing-library/react';
import TimePickerField from '../../components/TimePickerField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Mock the TimePicker component
jest.mock('@mui/x-date-pickers/TimePicker', () => ({
  TimePicker: jest.fn(({ value, label, onChange }) => (
    <div>
      <label htmlFor="time-picker-input">{label}</label>
      <input
        type="text"
        id="time-picker-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="mock-time-picker"
      />
    </div>
  ))
}));

describe('TimePickerField component', () => {
  it('TimePickerField renders with correct label and default value', () => {
    const label = 'Select Time';
    const defaultValue = null;

    const { getByLabelText } = render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePickerField
          label={label}
          defaultValue={defaultValue}
          onChange={() => {}}
        />
      </LocalizationProvider>
    );

    const timePickerLabel = getByLabelText(label);
    expect(timePickerLabel).toBeInTheDocument();
  });

  it('updates the state and calls onChange with the selected time', () => {
    const defaultValue = null;
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <TimePickerField
        label="Test Label"
        defaultValue={defaultValue}
        onChange={onChange}
      />
    );

    // Simulate selecting a new time
    fireEvent.change(getByLabelText('Test Label'), {
      target: { value: '12:00 PM' }
    });

    // Check that the state is updated
    expect(onChange).toHaveBeenCalledWith('12:00 PM');
  });
});
