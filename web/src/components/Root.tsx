import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

export default function Root() {
  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh', minWidth: '100vw' }}>
        <Sidebar />
        <Header />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1
          }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
