import { CssVarsProvider } from '@mui/joy/styles';
import { CssBaseline, Box, Typography } from '@mui/joy';
import ColorSchemeToggle from '../util/ColorSchemeToggle';
import { Outlet } from 'react-router-dom';

export default function Root() {
  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh', minWidth: '100vw' }}>
        <CssVarsProvider disableTransitionOnChange>
          <Box sx={{ display: '', gap: 1, alignItems: 'center' }}>
            <ColorSchemeToggle
              data-testid="color-toggle-button"
              sx={{
                position: 'flex',
                top: 0,
                left: 0,
                ml: 'auto'
              }}
            />
          </Box>
        </CssVarsProvider>
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
