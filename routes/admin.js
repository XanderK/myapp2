var express = require('express');
var userController = require('../api/controllers/user');
var router = express.Router();

let activeView = '';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Управление пользователями
router.get('/users', function(req, res, next) {
  // TODO: Запрос списка пользователей
  let users = Array();
  users.push(userController);

  activeView = 'users';
  res.render(activeView, { 
    title: 'Управление пользователями',
    activeView: activeView,
    users: users
  });
});

// Редактирование пользователя
router.get('/users/edit', function(req, res, next) {
  activeView = 'user';
  res.render(activeView, { 
    title: 'Редактирование пользователя',
    activeView: activeView,
    user: new Object
  });
});

module.exports = router;
