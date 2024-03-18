import * as React from 'react';
import { Button } from '@mui/joy';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import dayjs from 'dayjs';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TimePickerField from '../TimePickerField';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Reminder } from './RecommendedSchedule';
import { useAuth0 } from '@auth0/auth0-react';

interface ScheduleEditRowButtonProps {
  reminder: Reminder;
  onSubmit: () => void;
}

export default function ScheduleEditRowButton(
  props: ScheduleEditRowButtonProps
) {
  const { reminder, onSubmit } = props;

  const [open, setOpen] = React.useState(false);
  const [showEndTime, setShowEndTime] = React.useState(
    reminder.endTime ? true : false
  );
  const [startTime, setStartTime] = React.useState<dayjs.Dayjs | null>(
    dayjs(reminder.startTime)
  );
  const [endTime, setEndTime] = React.useState<dayjs.Dayjs | null>(
    dayjs(reminder.endTime)
  );
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onSubmit();
  };

  const handleCheckboxChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setShowEndTime(event.target.checked);
  };

  const { getAccessTokenSilently } = useAuth0();

  return (
    <div>
      <Button
        size="sm"
        variant="plain"
        color="neutral"
        onClick={handleClickOpen}>
        Edit
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ zIndex: 1100 }}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const updateReminder = async () => {
              const token = await getAccessTokenSilently();

              await fetch(
                `http://localhost:3000/reminders/${reminder.reminderId}/update`,
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    startTime: startTime,
                    endTime: endTime
                  })
                }
              );
            };

            updateReminder();

            handleClose();
          }
        }}>
        <DialogTitle>Edit an event</DialogTitle>
        <DialogContent>
          <DialogContentText>{reminder.description}</DialogContentText>
          <TimePickerField
            label="Start Time"
            defaultValue={startTime}
            onChange={setStartTime}
          />
          {showEndTime && (
            <TimePickerField
              label="End Time"
              defaultValue={dayjs(endTime)}
              onChange={setEndTime}
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={showEndTime}
                onChange={handleCheckboxChange}
              />
            }
            label="Has End Time"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Edit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
