const User = require('./models/user');
const config = require('./config');

module.exports.sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.createDefaultUsers = () => {
  // Cоздание пользователя для администрирования, если такового нет
  const adminUserName = 'admin';
  User.findOne({
    name: adminUserName
  }).then(user => {
    if (user == null) {
      User.register(new User({
        name: adminUserName,
        created: Date.now(),
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
        created: Date.now(),
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
