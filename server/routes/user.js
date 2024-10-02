const router = require('express').Router();
const User = require('../controller/userController');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/register', User.register);
router.post('/login', User.login);
router.get('/current', verifyAccessToken, User.getCurrent);
router.post('/refreshToken', User.refreshAccessToken);
router.get('/logout', User.logout);
router.get('/forgotPassword', User.forgotPassword);
router.put('/resetPassword', User.resetPassword);
router.get('/', [verifyAccessToken, isAdmin], User.getUsers);
router.delete('/', [verifyAccessToken, isAdmin], User.deleteUser);
router.put('/current', [verifyAccessToken], User.updateUser);
router.put('/:uid', [verifyAccessToken, isAdmin], User.updateUserByAdmin);

module.exports = router;
