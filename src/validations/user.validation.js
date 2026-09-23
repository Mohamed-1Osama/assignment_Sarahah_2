const Joi = require('joi');

const updateProfile = Joi.object({
  userName: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email(),
}).min(1); 
const userNameParam = Joi.object({
  userName: Joi.string().alphanum().min(3).max(30).required(),
});

module.exports = { updateProfile, userNameParam };
