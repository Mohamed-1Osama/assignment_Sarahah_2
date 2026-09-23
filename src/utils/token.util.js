const jwt = require('jsonwebtoken');
const { jwt: jwtCfg } = require('../config/env');


function signAccessToken(payload) {
  return jwt.sign(payload, jwtCfg.accessSecret, { expiresIn: jwtCfg.accessExpiresIn });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, jwtCfg.refreshSecret, { expiresIn: jwtCfg.refreshExpiresIn });
}

function verifyAccessToken(token) {
  return jwt.verify(token, jwtCfg.accessSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, jwtCfg.refreshSecret);
}

function generateAuthTokens(user) {
  const payload = { sub: user._id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { accessToken, refreshToken };
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateAuthTokens,
};
