const { auth } = require('express-openid-connect');
const jwksRsa = require('jwks-rsa');

const auth0Config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SESSION_SECRET || 'a long, randomly-generated string stored in env',
  baseURL: process.env.BASE_URL || 'http://localhost:5000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email',
  },
  routes: {
    callback: '/api/auth/callback',
    postLogoutRedirect: process.env.CLIENT_URL
  },
  // Use JWKS for production, but for development we can use simpler verification
  identityClaimFilter: ['iss', 'sub', 'aud', 'iat', 'exp', 'nonce', 'azp', 'auth_time'],
};

// JWKS configuration for production
const jwksConfig = {
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `${process.env.AUTH0_ISSUER}.well-known/jwks.json`
};

module.exports = { auth0Config, jwksConfig };