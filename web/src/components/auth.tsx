/* eslint-disable react-refresh/only-export-components */
import { useAuth0 } from '@auth0/auth0-react';
import { IconButton, Button } from '@mui/joy';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

export const LogoutButton: React.FC = () => {
  const { isAuthenticated, logout } = useAuth0();

  return (
    isAuthenticated && (
      <IconButton
        size="sm"
        variant="plain"
        color="neutral"
        data-testid="logout-button"
        onClick={() => {
          logout({
            logoutParams: {
              returnTo: window.location.origin
            }
          });
        }}>
        <LogoutRoundedIcon />
      </IconButton>
    )
  );
};

export const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return <Button onClick={() => loginWithRedirect()}>Log In</Button>;
};
