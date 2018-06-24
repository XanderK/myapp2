const express = require('express');
const router = express.Router();
const indexController = require('./controllers/indexController');
const catalogController = require('./controllers/catalogController');
const adminController = require('./controllers/adminController');
const helpers = require('./api/helpers');
//const passport = require('passport')

/* GET home page. */
router.get('/', indexController.homePage);

// Показать каталог
router.get('/catalog', catalogController.catalog);

// Вход на сайт
router.get('/admin/login', adminController.login);
router.post('/admin/login', adminController.login);

// Выход 
router.get('/admin/logout', adminController.logout);
// Управление пользователями
router.get('/admin/users', adminController.users);
// Регистрация пользователя
router.get('/admin/user', adminController.user);
// Редактирование пользователя
router.post('/admin/user/:id', adminController.user);

// Проверка залогинен ли кто-нибудь
router.get('/admin/checklogged', (req, res) => helpers.sendJSONresponse(res, 200, req.user));

module.exports = router;
