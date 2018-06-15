const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const passport = require('passport')
const auth = require('../auth')

router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Добавление пользователя
router.post('/users', function(req, res, next) {
    userController.createUser(req, res);
});

module.exports = router;
