const mongoose = require('mongoose');
const { Schema } = mongoose;

const ROLES = ['user', 'admin'];
const PROVIDERS = ['local', 'google'];

const userSchema = new Schema(
  {
    
    _id: { type: String },

    userName: {
      type: String,
      required: [true, 'userName is required'],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-zA-Z0-9_]+$/, 'userName may only contain letters, numbers and underscores'],
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: function () {
        return this.provider === 'local';
      },
      select: false, 
    },
    profileImage: {
      url: { type: String, default: null },
      publicId: { type: String, default: null }, 
    },
    provider: {
      type: String,
      enum: PROVIDERS,
      default: 'local',
    },
    googleId: { type: String, default: null, select: false },
    role: {
      type: String,
      enum: ROLES,
      default: 'user',
    },
    isActive: { type: Boolean, default: true },
    refreshTokenHash: { type: String, default: null, select: false }, 
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

userSchema.pre('validate', function (next) {
  if (!this._id && this.userName) {
    this._id = this.userName;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;
module.exports.PROVIDERS = PROVIDERS;
