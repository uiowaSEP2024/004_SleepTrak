import * as React from 'react';
import { Button } from '@mui/joy';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import dayjs from 'dayjs';
import DialogContent from '@mui/material/DialogContent';
import TimePickerField from '../TimePickerField';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { Reminder } from '@prisma/client';
import { useAuth0 } from '@auth0/auth0-react';
import API_URL from '../../util/apiURL';

interface ScheduleEditRowButtonProps {
  reminder: Reminder;
  onSubmit: () => Promise<void>;
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
  const [description, setDescription] = React.useState<string>(
    reminder.description
  );
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
                `http://${API_URL}/reminders/${reminder.reminderId}/update`,
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    description: description,
                    startTime: startTime,
                    endTime: endTime
                  })
                }
              );

              await onSubmit();
            };
            updateReminder();
            handleClose();
          }
        }}>
        <DialogTitle>Edit an event</DialogTitle>
        <DialogContent>
          <TextField
            id="outlined-controlled"
            label="Event Name"
            value={description}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDescription(event.target.value);
            }}
            sx={{ my: 1 }}
          />
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
          <Button
            aria-label="edit-row-submit"
            type="submit">
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
