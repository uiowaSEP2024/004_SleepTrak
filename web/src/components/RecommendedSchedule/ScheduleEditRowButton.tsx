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

export default function ScheduleEditRowButton() {
  const [open, setOpen] = React.useState(false);
  const [showEndTime, setShowEndTime] = React.useState(true);

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
            // TODO: handle submitting the schedule
            handleClose();
          }
        }}>
        <DialogTitle>Edit an event</DialogTitle>
        <DialogContent>
          <DialogContentText>Morning Rise</DialogContentText>
          <TimePickerField
            label="Start Time"
            defaultValue={dayjs('2023-07-18T07:00')}
          />
          {showEndTime && (
            <TimePickerField
              label="End Time"
              defaultValue={dayjs('2023-07-18T20:00')}
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
