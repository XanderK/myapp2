const passport = require('passport');
/*
module.exports.authenticationMiddleware  = function() {
    return function (req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      }
      res.redirect('/')
    }
  }
 */

  module.exports.authenticationMiddleware = passport.authenticate('local', { failureRedirect: '/login' });