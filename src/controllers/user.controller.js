const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const userService = require('../services/user.service');

const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getByUserName(req.params.userName);
  new ApiResponse(200, user, 'Profile fetched').send(res);
});

const updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  new ApiResponse(200, user, 'Profile updated').send(res);
});

const uploadAvatar = catchAsync(async (req, res) => {
  const user = await userService.updateProfileImage(req.user._id, req.file, 'cloudinary');
  new ApiResponse(200, user, 'Profile image updated').send(res);
});

const deleteAccount = catchAsync(async (req, res) => {
  await userService.deleteAccount(req.user._id);
  new ApiResponse(200, null, 'Account deleted').send(res);
});

module.exports = { getProfile, updateProfile, uploadAvatar, deleteAccount };
