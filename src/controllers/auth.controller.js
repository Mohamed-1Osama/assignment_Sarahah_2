const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/auth.service');

// Refresh token lives in an httpOnly cookie - JS on the client can never read it,
// which is the main defense against XSS stealing it.
const REFRESH_COOKIE = 'refreshToken';
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE, token, cookieOptions);
}

const register = catchAsync(async (req, res) => {
  const { user, tokens } = await authService.register(req.body);
  setRefreshCookie(res, tokens.refreshToken);
  new ApiResponse(201, { user, accessToken: tokens.accessToken }, 'Registered successfully').send(res);
});

const login = catchAsync(async (req, res) => {
  const { user, tokens } = await authService.login(req.body);
  setRefreshCookie(res, tokens.refreshToken);
  new ApiResponse(200, { user, accessToken: tokens.accessToken }, 'Logged in successfully').send(res);
});

const googleLogin = catchAsync(async (req, res) => {
  const { user, tokens } = await authService.loginWithGoogle(req.body.idToken);
  setRefreshCookie(res, tokens.refreshToken);
  new ApiResponse(200, { user, accessToken: tokens.accessToken }, 'Logged in with Google').send(res);
});

const refresh = catchAsync(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE] || req.body.refreshToken;
  const { tokens } = await authService.refresh(token);
  setRefreshCookie(res, tokens.refreshToken);
  new ApiResponse(200, { accessToken: tokens.accessToken }, 'Token refreshed').send(res);
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.user._id);
  res.clearCookie(REFRESH_COOKIE, cookieOptions);
  new ApiResponse(200, null, 'Logged out successfully').send(res);
});

const me = catchAsync(async (req, res) => {
  new ApiResponse(200, req.user, 'Current user').send(res);
});

module.exports = { register, login, googleLogin, refresh, logout, me };
