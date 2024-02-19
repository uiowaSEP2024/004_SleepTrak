/* eslint-disable react-refresh/only-export-components */
import {
  Auth0Provider,
  WithAuthenticationRequiredOptions,
  useAuth0,
  withAuthenticationRequired
} from '@auth0/auth0-react';
import { IconButton } from '@mui/joy';
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
interface ProtectedRouteProps extends WithAuthenticationRequiredOptions {
  component: React.ComponentType;
}

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth0();

  return (
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
  );
};

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
