const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

//let activeView = '';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Управление пользователями
router.get('/users', adminController.getAllUsers);

// Редактирование пользователя
router.get('/user', function(req, res, next) {
  activeView = 'user';
  res.render(activeView, { 
    title: 'Редактирование пользователя',
    activeView: activeView,
    user: new Object
  });
});

module.exports = router;
