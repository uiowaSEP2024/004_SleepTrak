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
  authorizationParams?: object;
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

/**
 * Gets user object for the currently authenticated user from Auth0.
 *
 * @returns {object} An object representing the currently authenticated user.
 *
 * @example
 * const user =  GetUserInfo();
 */
export const GetUserInfo = () => {
  const { user } = useAuth0();
  return user;
};

/**
EXAMPLE USAGE:

//// Getting token from Auth0 for API in a component
function ComponentThatUsesToken() {
  const [token, setToken] = useState("");
  const { getAccessTokenSilently} = useAuth0();

  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_API_AUDIENCE!,
          scope: "do:all",
        }
      });
      setToken(fetchedToken);
    };
    fetchToken();
  }, [getAccessTokenSilently]);

  return <h1>token: {token ? token : "No token"}</h1>;
}

//// Making API call with token in a component
function ComponentThatMakesApiCall() {
  const [apiData, setApiData] = useState("");
  const { getAccessTokenSilently} = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessTokenSilently();
      const response = await fetch("https://api.example.com/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setApiData(data);
    };
    fetchData();
  }, [getAccessTokenSilently]);

  return <h1>api data: {apiData ? apiData : "No data"}</h1>;
}
*/
