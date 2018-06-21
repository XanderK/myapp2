const express = require('express');
const userController = require('./controllers/userController');
const helpers = require('./helpers')
const router = express.Router();
const passport = require('passport')

router.post('/', (req, res, next) => {
  res.send('respond with a resource');
});

// Список всех пользователей
router.post('/users', passport.authenticate('local'), userController.getAllUsers);

// Регистрация нового пользователя
router.post('/register', passport.authenticate('local'), userController.registerUser);

// Вход на сайт
router.post('/login', passport.authenticate('local'), userController.login);

// Выход
router.post('/logout', passport.authenticate('local'), userController.logout);

// Проверка доступности сервиса
router.get('/ping', (req, res) => {
  res.status(200).send("pong!");
});

module.exports = router;
