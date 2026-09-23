const userRepository = require('../repositories/user.repository');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { generateAuthTokens, verifyRefreshToken } = require('../utils/token.util');
const { ConflictError, UnauthorizedError, BadRequestError } = require('../utils/ApiError');
const { verifyGoogleIdToken } = require('./google.service');
const withTransaction = require('../utils/withTransaction');

async function register({ userName, email, password }) {
  const existing = await userRepository.model.findOne({ $or: [{ email }, { userName }] });
  if (existing) {
    throw new ConflictError(
      existing.email === email ? 'Email already in use' : 'userName already taken'
    );
  }

  const hashedPassword = await hashPassword(password);

  
  const user = await withTransaction(async (session) => {
    return userRepository.create({ userName, email, password: hashedPassword }, { session });
  });

  const tokens = await issueTokens(user);
  return { user: sanitize(user), tokens };
}

async function login({ email, password }) {
  const user = await userRepository.findByEmailWithPassword(email);
  if (!user || user.provider !== 'local') {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const tokens = await issueTokens(user);
  return { user: sanitize(user), tokens };
}

async function loginWithGoogle(idToken) {
  const { googleId, email, name } = await verifyGoogleIdToken(idToken);

  let user = await userRepository.findByGoogleId(googleId);

  if (!user) {
    
    user = await userRepository.model.findOne({ email });
    if (user) {
      user.googleId = googleId;
      user.provider = user.provider === 'local' ? 'local' : 'google';
      await user.save();
    } else {
      const baseUserName = name ? name.replace(/\s+/g, '').toLowerCase() : email.split('@')[0];
      const uniqueUserName = `${baseUserName}${Math.floor(Math.random() * 10000)}`;
      user = await userRepository.create({
        userName: uniqueUserName,
        email,
        googleId,
        provider: 'google',
      });
    }
  }

  const tokens = await issueTokens(user);
  return { user: sanitize(user), tokens };
}

async function refresh(refreshToken) {
  if (!refreshToken) throw new BadRequestError('Refresh token missing');

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  const user = await userRepository.model.findById(payload.sub).select('+refreshTokenHash');
  if (!user) throw new UnauthorizedError('User no longer exists');

  // Compare against the hash stored at login time - if it doesn't match,
  // this token was already rotated/revoked (e.g. user logged out elsewhere).
  const { comparePassword: compareHash } = require('../utils/hash.util');
  const isValid = user.refreshTokenHash && (await compareHash(refreshToken, user.refreshTokenHash));
  if (!isValid) throw new UnauthorizedError('Refresh token has been revoked');

  const tokens = await issueTokens(user); 
  return { user: sanitize(user), tokens };
}

async function logout(userId) {
  await userRepository.setRefreshTokenHash(userId, null); 
}



async function issueTokens(user) {
  const tokens = generateAuthTokens(user);
  const refreshTokenHash = await hashPassword(tokens.refreshToken); 
  await userRepository.setRefreshTokenHash(user._id, refreshTokenHash);
  return tokens;
}

function sanitize(user) {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  delete obj.refreshTokenHash;
  delete obj.googleId;
  return obj;
}

module.exports = { register, login, loginWithGoogle, refresh, logout };
