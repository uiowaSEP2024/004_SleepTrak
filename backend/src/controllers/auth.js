var fetch = require('node-fetch');

module.exports = {
  login: (req, res) => {
    // This redirects to the auth0 login which, if succesful then redirects to the callback route.
    res.redirect(
      `https://${process.env.AUTH0_DOMAIN}/authorize?audience=${process.env.AUTH0_AUDIENCE}&response_type=code&client_id=${process.env.AUTH0_CLIENT_ID}&redirect_uri=${process.env.CALLBACK_URL}`
    );
  },
  callback: async (req, res) => {
    const code = req.query.code;

    try {
      const data = await fetch(
        `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(`${process.env.AUTH0_CLIENT_ID}:${process.env.AUTH0_CLIENT_SECRET}`).toString('base64')}`
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.CALLBACK_URL
          })
        }
      );

      if (!data.ok) {
        throw new Error('Token exchange failed');
      }

      const response = await data.json();

      req.session.accessToken = response.access_token; // Store access token in session
      res.status(200);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error');
    }
  }
};

// Protected Route Example
// app.get('/protected-route', requireAuth, (req, res) => {
//   // Access user data from req.user (decoded JWT)
//   console.log('Authenticated user:', req.user);
//   res.send('Welcome, authenticated user!');
// });
