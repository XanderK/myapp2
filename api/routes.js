const express = require('express');
const userController = require('./controllers/userController');
const helpers = require('./helpers')
const router = express.Router();
const passport = require('passport')

router.post('/', (req, res, next) => {
  res.send('respond with a resource');
});

// Список всех пользователей
router.post('/users', passport.authenticate('local'), (req, res, next) => {
  userController.getAllUsers(req, res);
});

router.post('/register', passport.authenticate('local'), (req, res) => {
  if(req.user.role === 'admin') {
    userController.registerUser(req, res);
  }
});

router.post('/login', passport.authenticate('local'), (req, res) => { 
    helpers.sendJSONresponse(res, 200, req.user);
  }
);

router.post('/logout', passport.authenticate('local'), (req, res) => {
  userController.logout(req, res, () => {
    helpers.sendJSONresponse(res, 200, 'Logout comlete.');
  });
});

router.get('/ping', (req, res) => {
  res.status(200).send("pong!");
});

module.exports = router;
