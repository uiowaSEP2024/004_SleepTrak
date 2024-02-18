import { Box, CssBaseline, Stack, Grid, Typography } from '@mui/joy';
import { Card } from '@mui/material';
import { LoginButton } from '../components/auth';

const LoginForm = () => {
  return (
    <Card
      sx={{
        minWidth: '20vw',
        minHeight: '30vh',
        borderRadius: '20px',
        padding: '30px'
      }}>
      <Stack
        spacing={5}
        alignItems="center"
        justifyContent="center">
        <Box>
          <Typography level="h1">Camila Sleep </Typography>
        </Box>
        <Box>
          <LoginButton />
        </Box>
      </Stack>
    </Card>
  );
};

function LoginPage() {
  return (
    <>
      <CssBaseline />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh', minWidth: '100vw' }}>
        <LoginForm />
      </Grid>
    </>
  );
}

export default LoginPage;
