const User = require('./models/user');
const config = require('./config');

module.exports.sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.createDefaultUsers = function () {
  // Cоздание пользователя для администрирования, если такового нет
  let username = 'admin';
  User.findOne({
    name: username
  }).then(user => {
    if (user == null) {
      //console.log(user);
      User.register(new User({
        name: username,
        created: Date.now(),
        role: 'admin'
      }),
        '123456').catch(err => {
          console.error(err);
        });
    }
  }).catch(err => {
    console.error(err);
  });

  // Cоздание пользователя для защиты точек API, если такового нет
  username = 'guest';
  User.findOne({
    name: username
  }).then(user => {
    if (user == null) {
      //console.log(user);
      User.register(new User({
        name: username,
        created: Date.now(),
        role: 'guest'
      }),
        config.guest_password).catch(err => {
          console.error(err);
        });
    }
  }).catch(err => {
    console.error(err);
  });
}
