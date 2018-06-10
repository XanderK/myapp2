var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Регистрация нового пользователя
router.get('/register', function(req, res, next) {
  res.render('user', { 
    title: 'Регистрация пользователя',
    activeView: 'register'
  });
});

module.exports = router;
