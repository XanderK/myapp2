const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const middleware = require('../auth/middleware')

router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Список всех пользователей
router.get('/users', function(req, res, next) {
  userController.getAllUsers(req, res);
});

router.get('/register', function(req, res) {
  res.render('register', { });
});

router.post('/register', function(req, res) {
  userController.registerUser(req,res);
});

router.get('/login', function(req, res) {
  res.render('login', { user : req.user });
});

router.post('/login', /*passport.authenticate('local'),*/ function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/ping', function(req, res){
  res.status(200).send("pong!");
});

module.exports = router;
