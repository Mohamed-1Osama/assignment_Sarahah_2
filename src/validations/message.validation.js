const Joi = require('joi');

const sendMessage = Joi.object({
  receiver: Joi.string().alphanum().min(3).max(30).required(),
  content: Joi.string().min(1).max(1000).required(),
  isAnonymous: Joi.boolean().default(true),
});

const messageIdParam = Joi.object({
  id: Joi.string().hex().length(24).required(), 
});

module.exports = { sendMessage, messageIdParam };
