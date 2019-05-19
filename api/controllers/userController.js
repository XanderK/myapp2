const User = require('../models/User');
const helpers = require('../helpers');
const config = require('../config');

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
    phone: req.body.phone,
    email: req.body.email,
    role: req.body.role
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
    user.phone = req.body.phone;
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

module.exports.createDefaultUsers = () => {
  // Cоздание пользователя для администрирования, если такового нет
  const adminUserName = 'admin';
  User.findOne({
    name: adminUserName
  }).then(user => {
    if (user == null) {
      User.register(new User({
        name: adminUserName,
        role: 'admin'
      }),
      config.default_admin_password).catch(err => {
          console.error(err);
        });
    }
    else {
      console.log('User "' + adminUserName + '" exists.')
    }
  }).catch(err => {
    console.error(err);
  });

  // Cоздание пользователя для защиты точек API, если такового нет
  const guestUserName = 'guest';
  User.findOne({
    name: guestUserName
  }).then(user => {
    if (user == null) {
      User.register(new User({
        name: guestUserName,
        role: 'guest'
      }),
        config.default_guest_password).catch(err => {
          console.error(err);
        });
    }
    else {
      console.log('User "' + guestUserName + '" exists.')
    }
  }).catch(err => {
    console.error(err);
  });
}
