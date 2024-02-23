const { auth } = require('express-oauth2-jwt-bearer');

// Auth filter for routes
const requireAuth = auth({
  secret: process.env.SECRET, // Generate JWKS dynamically
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'HS256'
});

module.exports = { requireAuth };
