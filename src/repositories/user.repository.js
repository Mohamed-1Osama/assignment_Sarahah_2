const BaseRepository = require('./base.repository');
const User = require('../models/user.model');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  findByEmailWithPassword(email) {
    return this.model.findOne({ email }).select('+password +refreshTokenHash');
  }

  findByUserNameWithPassword(userName) {
    return this.model.findOne({ userName }).select('+password +refreshTokenHash');
  }

  findByGoogleId(googleId) {
    return this.model.findOne({ googleId }).select('+googleId');
  }

  setRefreshTokenHash(userId, refreshTokenHash, session = null) {
    return this.model.findByIdAndUpdate(
      userId,
      { refreshTokenHash },
      { new: true, session }
    );
  }
}

module.exports = new UserRepository();
