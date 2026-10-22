import mongoose from "mongoose";
import { USER_ROLES, USER_GENDERS } from "../../Common/constants.js";

/**
 * firstName
 * lastName
 * fullName
 * email
 * password
 * age
 * gender
 * profilePicture
 */

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Firstname must be at least 3 characters long"],
      maxLength: [30, "Firstname must be at most 30 characters long"],
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Lastname must be at least 3 characters long"],
      maxlength: [30, "Lastname must be at most 30 characters long"],
    },

    email: {
      type: String,
      required: true,
      index: {
        name: "idx_email_unique",
        unique: true,
      },
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
    },
    
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    age: {
      type: Number,
      required: true,
      min: [18, "Age must be at least 18"],
    },

    role:{
      type:String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER
    },

    gender: {
      type: String,
      enum: Object.values(USER_GENDERS),
      required: true,
    },

    profilePicture: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,

    virtuals: {
      fullName: {
        get() {
          return `${this.firstName} __ ${this.lastName}`;
        },
      },
    },

    toObject: {virtuals: true},
    toJSON: {virtuals: true},
  }
);
console.log({allModels: mongoose.models});
   
const User = mongoose.model("User", userSchema);

export default User;