const catchAsync = require('../utils/catchAsync');
const { UnauthorizedError } = require('../utils/ApiError');
const { verifyAccessToken } = require('../utils/token.util');
const userRepository = require('../repositories/user.repository');

/**
 * Authentication Middleware: "who are you?"
 * Reads the access token, verifies its signature, loads the user,
 * and attaches it to req.user for downstream handlers.
 */
const authenticate = catchAsync(async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header && header.startsWith('Bearer ') ? header.split(' ')[1] : null;

  if (!token) {
    throw new UnauthorizedError('Access token missing');
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    throw new UnauthorizedError(
      err.name === 'TokenExpiredError' ? 'Access token expired' : 'Invalid access token'
    );
  }

  const user = await userRepository.findById(payload.sub);
  if (!user || !user.isActive) {
    throw new UnauthorizedError('User no longer exists or is inactive');
  }

  req.user = user;
  next();
});

module.exports = authenticate;
