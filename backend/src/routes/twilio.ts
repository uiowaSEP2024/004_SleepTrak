import express from 'express';
import { auth } from '../services/auth.js';
import { jwt } from 'twilio';

const router = express.Router();

// Protecting routes with auth0
router.use(auth.requireAuth);

// Routes
router.get('/token', (req, res) => {
  const identity = req.query.identity as string;
  console.log(identity);

  const token = new jwt.AccessToken(
    process.env.TWILIO_ACCOUNT_SID ?? '',
    process.env.TWILIO_API_KEY ?? '',
    process.env.TWILIO_API_SECRET ?? '',
    { identity }
  );

  const chatGrant = new jwt.AccessToken.ChatGrant({
    serviceSid: process.env.TWILIO_SERVICE_SID
  });
  token.addGrant(chatGrant);

  res.send({ token: token.toJwt() });
});

export default router;
