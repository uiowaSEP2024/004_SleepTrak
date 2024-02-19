import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import DashboardPage from './pages/DashboardPage';
import Root from './components/Root';
import ClientsPage from './pages/ClientsPage';
import BabiesPage from './pages/Babies';
import MessagesPage from './pages/Messages';
import LoginPage from './pages/Login';
import {
  Auth0ProviderWithRedirectCallback,
  ProtectedRoute
} from './components/auth';

const domain: string = import.meta.env.VITE_AUTH0_DOMAIN!;
const clientId: string = import.meta.env.VITE_AUTH0_CLIENT_ID!;

function App() {
  return (
    <Router>
      <Auth0ProviderWithRedirectCallback
        domain={domain}
        clientId={clientId}
        redirectUri={window.location.origin}>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="*"
            element={<ErrorPage />}
          />
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
              path="babies"
              element={<BabiesPage />}
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
