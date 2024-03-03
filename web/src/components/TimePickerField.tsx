import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Box } from '@mui/joy';

export interface TimePickerValueProps {
  label: string;
  defaultValue: Dayjs | null;
}

export default function TimePickerField(props: TimePickerValueProps) {
  const { label, defaultValue } = props;

  const [value, setValue] = React.useState<Dayjs | null>(defaultValue);

  return (
    <Box sx={{ my: '20px' }}>
      <TimePicker
        value={value}
        label={label}
        onChange={(newValue: React.SetStateAction<dayjs.Dayjs | null>) =>
          setValue(newValue)
        }
      />
    </Box>
  );
}
