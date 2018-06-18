const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

//let activeView = '';

router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

// Вход в систему
router.get('/login', (req, res, next) => {
  let activeView = 'login';
  res.render(activeView, { 
    title: 'Вход в систему',
    activeView: activeView
  });
});

// Управление пользователями
router.get('/users', adminController.getAllUsers);

// Редактирование пользователя
router.get('/user', (req, res, next) => {
  let activeView = 'user';
  res.render(activeView, { 
    title: 'Редактирование пользователя',
    activeView: activeView,
    user: new Object
  });
});

module.exports = router;
