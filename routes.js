const express = require('express');
const router = express.Router();
const indexController = require('./controllers/indexController');
const catalogController = require('./controllers/catalogController');
const adminController = require('./controllers/userController');
const helpers = require('./api/helpers');

// Проверка прав пользователя
const allowAccess = (roles) => {
  return (req, res, next) => {
    if(req.user && roles.includes(req.user.role)) next();
    else res.redirect('/admin/login');
  }
}

/* GET home page. */
router.get('/', indexController.homePage);

// Правила индексации для посковиков
router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: /admin/");
});

// Показать каталог
router.get('/catalog', catalogController.catalog);

// Показать продукт
router.get('/product', catalogController.product);

// Редактирование каталога
router.get('/admin/catalog', allowAccess(['admin','manager']), catalogController.catalogManager);
// Страница добавления нового элемента в каталог
router.get('/admin/catalog/new', allowAccess(['admin','manager']), catalogController.newProduct);
// Страница редактирования элемента каталога
router.post('/admin/catalog/edit', allowAccess(['admin','manager']), catalogController.editProduct);

// Создание нового элемента в каталоге
router.post('/admin/catalog', allowAccess(['admin','manager']), catalogController.createProduct);
// Обновление элемента в каталоге
router.post('/admin/catalog/update', allowAccess(['admin','manager']), catalogController.updateProduct);
// Удаление элемента из каталога
router.post('/admin/catalog/delete', allowAccess(['admin','manager']), catalogController.deleteProduct);

// Страница входа на сайт
router.get('/admin/login', adminController.login);
// Вход на сайт
router.post('/admin/login', adminController.authenticate);
// Выход 
router.get('/admin/logout', adminController.logout);

// Страница управление пользователями
router.get('/admin/users', allowAccess(['admin']), adminController.users);
// Страница регистрация нового пользователя
router.get('/admin/users/new', allowAccess(['admin']), adminController.newUser);
// Страница редактирования пользователя
//router.get('/admin/users/edit/:id', allowAccess(['admin']), adminController.editUser);
router.post('/admin/users/edit', allowAccess(['admin']), adminController.editUser);

// Создание нового пользователя
router.post('/admin/users', allowAccess(['admin']), adminController.createUser);
// Обновление пользователя
router.post('/admin/users/update', allowAccess(['admin']), adminController.updateUser);
// Удаление пользователя
router.post('/admin/users/delete', allowAccess(['admin']), adminController.deleteUser);

// Проверка залогинен ли кто-нибудь
router.get('/admin/checklogged', (req, res) => helpers.sendJSONresponse(res, 200, req.user));

module.exports = router;
