const Joi = require('joi');

const register = Joi.object({
  userName: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(64).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .message('Password must contain at least one lowercase, one uppercase and one digit'),
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const googleLogin = Joi.object({
  idToken: Joi.string().required(), 
});

const refresh = Joi.object({
  refreshToken: Joi.string().optional(), 
});

module.exports = { register, login, googleLogin, refresh };
