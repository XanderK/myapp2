const User = require('../models/user');
const passport = require('passport')
const helpers = require('../helpers');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports.login = (req, res, next) => {
  /*
  req.login(user, (err) => {
    if (err) { return next(err); }

    // Формирование JWT
    const token = jwt.sign({ id: user._id, name: user.name, role: user.role },
      config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
    helpers.sendJSONresponse(res, 200, { auth: true, token: token });
  });
  */
  
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { helpers.sendJSONresponse(res, 200, { auth: false, message: 'Invalid username or password.' }); }
    req.login(user, (err) => {
      if (err) { return next(err); }

      // Формирование JWT
      const token = jwt.sign({ id: user._id, name: user.name, role: user.role },
        config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
      helpers.sendJSONresponse(res, 200, { auth: true, token: token });
    });
  })(req, res, next);
}

module.exports.logout = (req, res, next) => {
  req.logout();
  helpers.sendJSONresponse(res, 200, { auth: false, message: 'Logout successful.' });
}

module.exports.getAllUsers = (req, res) => {
  User.find().then(users => {
    helpers.sendJSONresponse(res, 200, users);
  }).catch(err => {
    console.log(err);
    helpers.sendJSONresponse(res, 400, err);
  });
}

module.exports.registerUser = (req, res) => {
  if (req.user.role !== 'admin') {
    helpers.sendJSONresponse(res, 401, { auth: false, message: 'Unauthorized.' });
  }
  User.register(new User({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    created: Date.now()
  }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        helpers.sendJSONresponse(res, 400, { auth: false, message: err });
        //return res.render('register', { account : account });
      }
      else {
        /*
        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    console.log(err);
                    helpers.sendJSONresponse(res, 400, err);
                }
                else {
                    helpers.sendJSONresponse(res, 200, user);
                }
            });
        });
        */
        passport.authenticate('local', { failureRedirect: '/login' }, (req, res) => res.redirect('/'));
      }
    });
}
