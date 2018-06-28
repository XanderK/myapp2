const express = require('express');
const router = express.Router();
const indexController = require('./controllers/indexController');
const catalogController = require('./controllers/catalogController');
const adminController = require('./controllers/adminController');
const helpers = require('./api/helpers');
const passport = require('passport')

/* GET home page. */
router.get('/', indexController.homePage);

// Показать каталог
router.get('/catalog', catalogController.catalog);

// Страница входа на сайт
router.get('/admin/login', adminController.login);
// Вход на сайт
router.post('/admin/login', adminController.authenticate);
// Выход 
router.get('/admin/logout', adminController.logout);

// Страница управление пользователями
router.get('/admin/users', adminController.users);
// Страница регистрация нового пользователя
router.get('/admin/users/new', adminController.newUser);
// Страница редактирования пользователя
router.post('/admin/users', adminController.editUser);

// Создание нового пользователя
router.post('/admin/users', adminController.createUser);
// Обновление пользователя
router.post('/admin/users/update', adminController.updateUser);
// Удаление пользователя
router.post('/admin/users/delete', adminController.deleteUser);

// Проверка залогинен ли кто-нибудь
router.get('/admin/checklogged', (req, res) =>
  helpers.sendJSONresponse(res, 200, req.user));

module.exports = router;
