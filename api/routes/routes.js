var express = require('express');
var userController = require('../controllers/userController');
var router = express.Router();

router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Добавление пользователя
router.post('/users', function(req, res, next) {
    userController.createUser(req, res);
});

module.exports = router;
