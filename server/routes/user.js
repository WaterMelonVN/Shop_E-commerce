const router = require('express').Router();
const User = require('../controller/userController');

router.post('/register', User.register);

module.exports = router;
