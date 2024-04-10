import * as React from 'react';
import { Button } from '@mui/joy';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { useAuth0 } from '@auth0/auth0-react';
import DeleteIcon from '@mui/icons-material/Delete';
import API_URL from '../../util/apiURL';

interface FileDeleteButtonProps {
  fileId: string;
  onChange: () => Promise<void>;
}

export default function FileDeleteButton(props: FileDeleteButtonProps) {
  const { fileId, onChange } = props;
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
      <DeleteIcon onClick={handleClickOpen} />
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

              await fetch(`http://${API_URL}/files/${fileId}/delete`, {
                method: 'Delete',
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });

              await onChange();
            };
            deleteReminder();
            handleClose();
          }
        }}>
        <DialogTitle id="alert-dialog-title">{'Delete this file?'}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button type="submit">Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
