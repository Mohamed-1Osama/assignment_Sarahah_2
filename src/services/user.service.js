const userRepository = require('../repositories/user.repository');
const messageRepository = require('../repositories/message.repository');
const storageService = require('./storage.service');
const withTransaction = require('../utils/withTransaction');
const { NotFoundError } = require('../utils/ApiError');

async function getByUserName(userName) {
  const user = await userRepository.findById(userName);
  if (!user) throw new NotFoundError('User not found');
  return user;
}

async function updateProfile(userId, updates) {
  const user = await userRepository.updateById(userId, updates);
  if (!user) throw new NotFoundError('User not found');
  return user;
}

async function updateProfileImage(userId, file, provider = 'cloudinary') {
  const user = await userRepository.findById(userId);
  if (!user) throw new NotFoundError('User not found');

  
  if (user.profileImage?.publicId) {
    await storageService.remove(user.profileImage.publicId, provider);
  }

  const uploaded =
    provider === 'cloudinary'
      ? await storageService.uploadToCloudinary(file.buffer, 'confession-app/avatars')
      : storageService.uploadLocalFile(file);

  return userRepository.updateById(userId, { profileImage: uploaded });
}


async function deleteAccount(userId) {
  await withTransaction(async (session) => {
    const user = await userRepository.deleteById(userId, { session });
    if (!user) throw new NotFoundError('User not found');
    await messageRepository.deleteAllForReceiver(userId, session);
  });
}

module.exports = { getByUserName, updateProfile, updateProfileImage, deleteAccount };
