const express = require('express');
const userController = require('./controllers/userController');
const helpers = require('./helpers')
const router = express.Router();
const config = require('./config');
const jwt = require('jsonwebtoken');

// Проверка прав пользователя
const authenticate = (roles) => {
  return (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return helpers.sendJSONresponse(res, 401, { auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) return helpers.sendJSONresponse(res, 401, { auth: false, message: 'Failed to authenticate token.' });
      if(roles.includes(decoded.role)) next();
    });
  }
}

router.post('/', (req, res, next) => {
  res.send('respond with a resource');
});

// Список всех пользователей
router.post('/users', authenticate(['admin']), userController.getAllUsers);

// Регистрация нового пользователя
router.post('/register', authenticate(['admin']), userController.registerUser);

// Проверка доступности сервиса
router.get('/ping', (req, res) => {
  res.status(200).send("pong!");
});

// Удаление пользователя
router.delete('/delete/:id', authenticate(['admin']), userController.deleteUser);

module.exports = router;
