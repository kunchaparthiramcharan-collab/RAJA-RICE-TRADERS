const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    env: {
      hasJwt: !!process.env.JWT_SECRET,
      hasTursoUrl: !!process.env.TURSO_CONNECTION_URL,
      hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
      hasEmailUser: !!process.env.SUPPORT_EMAIL_USER,
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL
    }
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
