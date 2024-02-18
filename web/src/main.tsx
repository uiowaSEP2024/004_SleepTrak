import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';

const domain: string = import.meta.env.VITE_AUTH0_DOMAIN!;
const clientId: string = import.meta.env.VITE_AUTH0_CLIENT_ID!;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin
    }}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Auth0Provider>
);
