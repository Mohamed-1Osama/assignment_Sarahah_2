const router = require('express').Router();
const controller = require('../controllers/user.controller');
const validate = require('../middlewares/validation.middleware');
const authenticate = require('../middlewares/auth.middleware');
const { uploadMemory } = require('../middlewares/upload.middleware');
const userValidation = require('../validations/user.validation');

router.get('/:userName', validate(userValidation.userNameParam, 'params'), controller.getProfile);

router.patch('/me', authenticate, validate(userValidation.updateProfile), controller.updateProfile);
router.post('/me/avatar', authenticate, uploadMemory.single('avatar'), controller.uploadAvatar);
router.delete('/me', authenticate, controller.deleteAccount);

module.exports = router;
