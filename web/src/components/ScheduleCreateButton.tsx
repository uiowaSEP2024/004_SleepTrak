import * as React from 'react';
import Button from '@mui/joy/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slider from '@mui/joy/Slider';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Grid from '@mui/joy/Grid';
import { Box } from '@mui/joy';

export interface TimePickerValueProps {
  label: string;
}

export interface WakeWindowInputFieldProps {
  label: string;
}

function TimePickerValue(props: TimePickerValueProps) {
  const { label } = props;

  const [value, setValue] = React.useState<Dayjs | null>(
    dayjs('2022-04-17T07:00')
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ my: '20px' }}>
        <TimePicker
          value={value}
          label={label}
          onChange={(newValue: React.SetStateAction<dayjs.Dayjs | null>) =>
            setValue(newValue)
          }
        />
      </Box>
    </LocalizationProvider>
  );
}

function WakeWindowInputField(props: WakeWindowInputFieldProps) {
  const { label } = props;

  return (
    <TextField
      id="outlined-number"
      label={label}
      type="number"
      defaultValue="3"
      sx={{ my: '10px' }}
      inputProps={{
        step: 0.25,
        min: 0
      }}
      InputLabelProps={{
        shrink: true
      }}
    />
  );
}

export default function ScheduleCreateButton() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        size="sm"
        variant="soft"
        color="primary"
        onClick={handleClickOpen}
        sx={{ m: 2 }}>
        Add Schedule
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ zIndex: 1100 }}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            // TODO: handle submittint the schedule
            handleClose();
          }
        }}>
        <DialogTitle>Create a new schedule</DialogTitle>
        <DialogContent>
          <Grid
            container
            spacing={3}
            sx={{ flexGrow: 1 }}>
            <Grid xs>
              <DialogContentText>Number of Naps</DialogContentText>
              <Slider
                defaultValue={2}
                marks
                max={6}
                valueLabelDisplay="auto"
              />
              <TimePickerValue label="Earliest Get Ready Time for Bed" />
              <TimePickerValue label="Wake Up Time" />
            </Grid>
            <Grid xs>
              <DialogContentText>Wake Windows</DialogContentText>
              <WakeWindowInputField label="Nap 1" />
              <WakeWindowInputField label="Nap 2" />
              <WakeWindowInputField label="Nap 3" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
