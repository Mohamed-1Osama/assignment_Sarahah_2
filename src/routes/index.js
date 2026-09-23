const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/messages', require('./message.routes'));

router.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

module.exports = router;
