const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    receiver: {
      type: String, 
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: 1000,
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
    
    senderEncrypted: {
      type: String,
      default: null,
    },
    attachment: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

messageSchema.index({ receiver: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
