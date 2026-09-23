const router = require('express').Router();
const controller = require('../controllers/message.controller');
const validate = require('../middlewares/validation.middleware');
const authenticate = require('../middlewares/auth.middleware');
const { uploadMemory } = require('../middlewares/upload.middleware');
const messageValidation = require('../validations/message.validation');

router.post(
  '/',
  authenticate,
  uploadMemory.single('attachment'),
  validate(messageValidation.sendMessage),
  controller.send
);

router.get('/inbox', authenticate, controller.inbox);

router.patch(
  '/:id/read',
  authenticate,
  validate(messageValidation.messageIdParam, 'params'),
  controller.markRead
);

router.delete(
  '/:id',
  authenticate,
  validate(messageValidation.messageIdParam, 'params'),
  controller.remove
);

module.exports = router;
