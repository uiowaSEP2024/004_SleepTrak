import * as React from 'react';
import { Button } from '@mui/joy';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

export interface DeleteScheduleDialogueProps {
  open: boolean;
  onClose: () => void;
}

function DeleteScheduleDialogue(props: DeleteScheduleDialogueProps) {
  const { open, onClose } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ zIndex: '15000' }}>
      <DialogTitle id="alert-dialog-title">
        {'Delete this schedule?'}
      </DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button
          onClick={onClose}
          autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ScheduleDeleteButton() {
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
        color="danger"
        sx={{ m: 2 }}
        onClick={handleClickOpen}>
        Delete Schedule
      </Button>
      <DeleteScheduleDialogue
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
