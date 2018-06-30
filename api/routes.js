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
router.get('/users', authenticate(['admin']), userController.allUsers);

// Создание нового пользователя
router.post('/users', authenticate(['admin']), userController.createUser);

// Обновление пользователя
router.put('/users/:id', authenticate(['admin']), userController.updateUser);

// Удаление пользователя
router.delete('/users', authenticate(['admin']), userController.deleteUser);


// Проверка доступности сервиса
router.get('/ping', (req, res) => {
  res.status(200).send("pong!");
});


module.exports = router;
