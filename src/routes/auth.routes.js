const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const validate = require('../middlewares/validation.middleware');
const authenticate = require('../middlewares/auth.middleware');
const authValidation = require('../validations/auth.validation');

router.post('/register', validate(authValidation.register), controller.register);
router.post('/login', validate(authValidation.login), controller.login);
router.post('/google', validate(authValidation.googleLogin), controller.googleLogin);
router.post('/refresh', validate(authValidation.refresh), controller.refresh);
router.post('/logout', authenticate, controller.logout);
router.get('/me', authenticate, controller.me);

module.exports = router;
