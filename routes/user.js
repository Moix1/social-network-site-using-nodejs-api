const express = require('express');
const { userById, getUsers, getUser, updateUser, deleteUser } = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');

const router = express.Router();

router.get('/users', getUsers);
router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, updateUser);
router.delete('/user/:userId', requireSignin, deleteUser);
// any route contain :userId, our app will execute first userById() method.
router.param('userId', userById);

module.exports = router;
