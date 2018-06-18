const express = require('express');
const userController = require('../controllers/userController');
const helpers = require('../helpers')
const router = express.Router();
const passport = require('passport')
const middleware = require('../auth/middleware')

router.post('/', (req, res, next) => {
  res.send('respond with a resource');
});

// Список всех пользователей
router.get('/users', (req, res, next) => {
  userController.getAllUsers(req, res);
});

router.get('/register', (req, res) => {
  res.render('register', { });
});

router.post('/register', (req, res) => {
  userController.registerUser(req, res);
});

//router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/admin/login' }));


router.post('/login', passport.authenticate('local'), (req, res) => { 
  if(req.user.role === 'read') {
    helpers.sendJSONresponse(res, 200, 'read');
  }
  else if(req.user.role === 'readwrite') {
    helpers.sendJSONresponse(res, 200, 'readwrite');   
  }
  if(req.user.role === 'admin') {
    helpers.sendJSONresponse(res, 200, 'admin');
  }
  else{
    helpers.sendJSONresponse(res, 200, '???');
  }
});


router.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/ping', (req, res) => {
  res.status(200).send("pong!");
});

module.exports = router;
