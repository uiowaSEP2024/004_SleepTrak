import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ChangeEvent, useState } from 'react';
import API_URL from '../../util/apiURL';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

export interface FileUploadButtonProps {
  onUpload: () => Promise<void>;
}

export default function FileUploadButton(props: FileUploadButtonProps) {
  const { onUpload } = props;
  const { getAccessTokenSilently } = useAuth0();
  const [open, setOpen] = useState(false);
  const { babyId } = useParams();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const postFile = async () => {
      const token = await getAccessTokenSilently();

      const formData = new FormData();
      if (event.target.files) {
        formData.append('file', event.target.files[0]);
      }
      if (babyId) {
        formData.append('babyId', babyId);
      }
      try {
        await fetch(`http://${API_URL}/files/create`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });
        await onUpload();
        handleOpen();
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
      }
    };
    onUpload;
    postFile();
  };

  return (
    <>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{ my: 3 }}>
        Upload file
        <VisuallyHiddenInput
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ zIndex: '15000' }}
        PaperProps={{
          component: 'form'
        }}>
        <DialogTitle id="alert-dialog-title">
          {'File has been successfully uploaded!'}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Okay</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
