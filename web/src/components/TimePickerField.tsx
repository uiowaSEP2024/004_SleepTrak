import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Box } from '@mui/joy';

interface TimePickerValueProps {
  label: string;
  defaultValue: Dayjs | null;
  onChange: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
}

export default function TimePickerField(props: TimePickerValueProps) {
  const { label, defaultValue, onChange } = props;

  const [value, setValue] = React.useState<Dayjs | null>(defaultValue);

  const handleOnChange = (
    newValue: React.SetStateAction<dayjs.Dayjs | null>
  ) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Box sx={{ my: '20px' }}>
      <TimePicker
        value={value}
        label={label}
        onChange={handleOnChange}
      />
    </Box>
  );
}
