const { OAuth2Client } = require('google-auth-library');
const { google } = require('../config/env');
const { UnauthorizedError } = require('../utils/ApiError');

const client = new OAuth2Client(google.clientId);


async function verifyGoogleIdToken(idToken) {
  let ticket;
  try {
    ticket = await client.verifyIdToken({ idToken, audience: google.clientId });
  } catch (err) {
    throw new UnauthorizedError('Invalid Google ID token');
  }

  const payload = ticket.getPayload();
  if (!payload.email_verified) {
    throw new UnauthorizedError('Google email is not verified');
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };
}

module.exports = { verifyGoogleIdToken };
