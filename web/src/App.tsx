import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import DashboardPage from './pages/DashboardPage';
import Root from './components/Root';
import ClientsPage from './pages/ClientsPage';
import MessagesPage from './pages/Messages';
import {
  Auth0ProviderWithRedirectCallback,
  ProtectedRoute
} from './components/auth';
import BabyDetailsPage from './pages/BabyDetailsPage';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const domain: string = import.meta.env.VITE_AUTH0_DOMAIN!;
const clientId: string = import.meta.env.VITE_AUTH0_CLIENT_ID!;

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <Auth0ProviderWithRedirectCallback
          domain={domain}
          clientId={clientId}
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: import.meta.env.VITE_AUTH0_API_AUDIENCE
          }}>
          <Routes>
            <Route
              path="*"
              element={<ErrorPage />}
            />
            {/* if you need a route that is not auth protected, then make a <route></route> element outside of this one. */}
            <Route
              path="/"
              element={<ProtectedRoute component={Root} />}>
              <Route
                path="dashboard"
                element={<DashboardPage />}
              />
              <Route
                path="clients"
                element={<ClientsPage />}
              />
              <Route
                path="/babies/:babyId"
                element={<BabyDetailsPage />}
              />
              <Route
                path="messages"
                element={<MessagesPage />}
              />
            </Route>
          </Routes>
        </Auth0ProviderWithRedirectCallback>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
