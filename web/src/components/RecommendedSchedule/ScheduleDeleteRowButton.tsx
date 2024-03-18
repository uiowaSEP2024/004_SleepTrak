import * as React from 'react';
import { Button } from '@mui/joy';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Reminder } from './RecommendedSchedule';
import { useAuth0 } from '@auth0/auth0-react';

interface ScheduleDeleteRowButtonProps {
  reminder: Reminder;
  onSubmit: () => void;
}

export default function ScheduleDeleteRowButton(
  props: ScheduleDeleteRowButtonProps
) {
  const { reminder, onSubmit } = props;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onSubmit();
  };

  const { getAccessTokenSilently } = useAuth0();

  return (
    <div>
      <Button
        size="sm"
        variant="soft"
        color="danger"
        onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ zIndex: '15000' }}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const deleteReminder = async () => {
              const token = await getAccessTokenSilently();

              await fetch(
                `http://localhost:3000/reminders/${reminder.reminderId}/delete`,
                {
                  method: 'Delete',
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              );
            };

            deleteReminder();

            handleClose();
          }
        }}>
        <DialogTitle id="alert-dialog-title">{'Delete this row?'}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button type="submit">Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
