const User = require('../models/user');
const helpers = require('../helpers');

module.exports.logout = (req, res, next) => {
  req.logout(() => {
    helpers.sendJSONresponse(res, 200, { auth: false, message: 'Logout successful.' });
  });
}

module.exports.allUsers = (req, res) => {
  User.find().then(users => {
    helpers.sendJSONresponse(res, 200, users);
  }).catch(err => {
    console.error(err);
    helpers.sendJSONresponse(res, 400, err);
  });
}

module.exports.userById = (req, res) => {
  User.findById(req.params.id).then(user => {
    helpers.sendJSONresponse(res, 200, user);
  }).catch(err => {
    helpers.sendJSONresponse(res, 400, err);
  });
}

module.exports.createUser = (req, res) => {
  User.register(new User({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    created: Date.now()
  }),
    req.body.password,
    (err, user) => {
      if (err) return helpers.sendJSONresponse(res, 400, err);
      helpers.sendJSONresponse(res, 200, { auth: true, message: 'User "' + user.name + '" successfuly created.' });
    });
}

module.exports.updateUser = (req, res) => {
  User.findById(req.body.id).then(user => {
    user.name = req.body.name;
    user.email = req.body.email;
    user.role = req.body.role;
    if(req.body.password) {
      user.setPassword(req.body.password, (err, user, passwordErr) => {
        if(err) return helpers.sendJSONresponse(res, 400, err);
        if(passwordErr) return helpers.sendJSONresponse(res, 400, passwordErr);
        user.save((err, user) => {
          if(err) return helpers.sendJSONresponse(res, 400, err);
          helpers.sendJSONresponse(res, 200, user);
        });
      });
    }
    else {
      user.save((err, user) => {
        if(err) return helpers.sendJSONresponse(res, 400, err);
        helpers.sendJSONresponse(res, 200, user);
      });
    }
  }).catch(err => {
    helpers.sendJSONresponse(res, 400, err);
  });
}

module.exports.deleteUser = (req, res) => {
  User.remove({ _id: req.body.id }, (err) => {
    if(err) helpers.sendJSONresponse(res, 400, err);
    helpers.sendJSONresponse(res, 200, { auth: true, message: 'User with ID "' + req.body.id + '" successfuly deleted.' });
  });
}
