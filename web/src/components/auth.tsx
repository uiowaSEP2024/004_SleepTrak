/* eslint-disable react-refresh/only-export-components */
import {
  Auth0Provider,
  WithAuthenticationRequiredOptions,
  useAuth0,
  withAuthenticationRequired
} from '@auth0/auth0-react';
import { IconButton, Button } from '@mui/joy';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';
interface Auth0ProviderProps {
  children: ReactNode;
  domain: string;
  clientId: string;
  redirectUri?: string;
}
interface AppState {
  returnTo?: string;
}

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

interface ProtectedRouteProps extends WithAuthenticationRequiredOptions {
  component: React.ComponentType;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component,
  ...args
}) => {
  const Component = withAuthenticationRequired(component, args);
  return <Component />;
};

export const Auth0ProviderWithRedirectCallback: React.FC<
  Auth0ProviderProps
> = ({ children, ...props }) => {
  const navigate = useNavigate();
  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };
  return (
    <Auth0Provider
      onRedirectCallback={onRedirectCallback}
      {...props}>
      {children}
    </Auth0Provider>
  );
};
