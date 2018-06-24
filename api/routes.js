const express = require('express');
const userController = require('./controllers/userController');
const helpers = require('./helpers')
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('./config');

// Проверка прав пользователя
const authenticate = (roles) => {
  return (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return helpers.sendJSONresponse(res, 401, { auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) return helpers.sendJSONresponse(res, 401, { auth: false, message: 'Failed to authenticate token.' });
      next();
    });
  }
}

router.post('/', (req, res, next) => {
  res.send('respond with a resource');
});

// Список всех пользователей
router.post('/users', authenticate(['admin']), userController.getAllUsers);

// Регистрация нового пользователя
router.post('/register', userController.registerUser);

// Вход на сайт
router.post('/login', userController.login);

// Выход
router.post('/logout', userController.logout);

// Проверка доступности сервиса
router.get('/ping', (req, res) => {
  res.status(200).send("pong!");
});

// Проверка залогинен ли кто-нибудь
router.get('/checklogged', (req, res) => helpers.sendJSONresponse(res, 200, req.user));

module.exports = router;
