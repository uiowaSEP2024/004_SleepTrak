import * as React from 'react';
import { Button } from '@mui/joy';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Plan } from '@prisma/client';
import { useAuth0 } from '@auth0/auth0-react';

interface ScheduleEditRowButtonProps {
  schedule: Plan;
  onSubmit: () => Promise<void>;
}

export default function ScheduleDeleteButton(
  props: ScheduleEditRowButtonProps
) {
  const { schedule, onSubmit } = props;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { getAccessTokenSilently } = useAuth0();

  return (
    <div>
      <Button
        size="sm"
        variant="soft"
        color="danger"
        sx={{ m: 2 }}
        onClick={handleClickOpen}>
        Delete Schedule
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
            const deleteSchedule = async () => {
              const token = await getAccessTokenSilently();

              await fetch(
                `http://localhost:3000/plans/${schedule.planId}/delete`,
                {
                  method: 'Delete',
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              );

              await onSubmit();
            };

            deleteSchedule();
          }
        }}>
        <DialogTitle id="alert-dialog-title">
          {'Delete this schedule?'}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button
            onClick={handleClose}
            type="submit">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
