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
import ClientPage from './pages/ClientPage';

const domain: string = import.meta.env.VITE_AUTH0_DOMAIN!;
const clientId: string = import.meta.env.VITE_AUTH0_CLIENT_ID!;

function App() {
  return (
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
              path="/client/:clientId"
              element={<ClientPage />}
            />
            <Route
              path="messages"
              element={<MessagesPage />}
            />
          </Route>
        </Routes>
      </Auth0ProviderWithRedirectCallback>
    </Router>
  );
}

export default App;
