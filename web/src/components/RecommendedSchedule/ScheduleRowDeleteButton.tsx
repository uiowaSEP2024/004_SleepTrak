import * as React from 'react';
import { Button } from '@mui/joy';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

export interface DeleteRowDialogueProps {
  open: boolean;
  onClose: () => void;
}

function DeleteRowDialogue(props: DeleteRowDialogueProps) {
  const { open, onClose } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ zIndex: '15000' }}>
      <DialogTitle id="alert-dialog-title">{'Delete this row?'}</DialogTitle>
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

export default function ScheduleDeleteRowButton() {
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
        onClick={handleClickOpen}>
        Delete
      </Button>
      <DeleteRowDialogue
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
