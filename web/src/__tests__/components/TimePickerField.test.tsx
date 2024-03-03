import '@testing-library/jest-dom';
import '../../util/setupDomTests';
import { render } from '@testing-library/react';
import TimePickerField from '../../components/TimePickerField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

describe('TimePickerField component', () => {
  it('TimePickerField renders with correct label and default value', () => {
    const label = 'Select Time';
    const defaultValue = null;

    const { getByLabelText } = render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePickerField
          label={label}
          defaultValue={defaultValue}
        />
      </LocalizationProvider>
    );

    const timePickerLabel = getByLabelText(label);
    expect(timePickerLabel).toBeInTheDocument();
  });
});
