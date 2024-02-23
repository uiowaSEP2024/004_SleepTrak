import { auth } from 'express-oauth2-jwt-bearer';

// Auth filter for routes
export const requireAuth = auth({
  secret: process.env.SECRET, // Generate JWKS dynamically
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'HS256'
});
