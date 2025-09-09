import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = 'dev-i75xlbho16573bo8.us.auth0.com';
const clientId ='KVbqW5NhTOrENv6W6ADgru5sIcVDZJJs';
const audience = 'https://dev-i75xlbho16573bo8.us.auth0.com/api/v2/';
const callbackUrl = window.location.origin;

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: callbackUrl,
      audience
    }}
  >
    <App />
  </Auth0Provider>
);
