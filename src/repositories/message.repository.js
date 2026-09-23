const BaseRepository = require('./base.repository');
const Message = require('../models/message.model');

class MessageRepository extends BaseRepository {
  constructor() {
    super(Message);
  }

  findByReceiver(receiver, options) {
    return this.findAll({ receiver }, options);
  }

  markAsRead(id, session = null) {
    return this.model.findByIdAndUpdate(id, { isRead: true }, { new: true, session });
  }

  deleteAllForReceiver(receiver, session = null) {
    return this.model.deleteMany({ receiver }, { session });
  }
}

module.exports = new MessageRepository();
