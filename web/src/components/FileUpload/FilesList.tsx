import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import { File } from '@prisma/client';
import { Link } from 'react-router-dom';
import FileDeleteButton from './FileDeleteButton';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper
}));

export interface FilesListProps {
  files: File[];
  onChange: () => Promise<void>;
}

export default function filesList(props: FilesListProps) {
  const { files, onChange } = props;
  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <Grid
        item
        xs={12}
        md={6}>
        <Typography
          sx={{ mb: 2 }}
          variant="h6"
          component="div">
          Upload PDF Files
        </Typography>
        <Demo>
          <List>
            {files.map((file) => (
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete">
                    <FileDeleteButton
                      fileId={file.fileId}
                      onChange={onChange}
                    />
                  </IconButton>
                }>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Link
                      to={`${file.url}`}
                      target="_blank"
                      download>
                      {file.filename}
                    </Link>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Demo>
      </Grid>
    </Box>
  );
}
