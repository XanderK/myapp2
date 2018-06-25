const passport = require('passport')
const jwt = require('jsonwebtoken');
const request = require('request');
const config = require('../api/config');
const User = require('../api/models/user');

const apiOptions = {
  server: config.server
};

module.exports.authenticate = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/admin/login'); }
    req.login(user, (err) => {
      if (err) { return next(err); }

      // Формирование JWT
      req.session.token = jwt.sign({ id: user.id, name: user.name, role: user.role },
        config.secret, {
          expiresIn: 86400 // expires in 24 hours
      });
      return res.redirect('/');

    });
  })(req, res, next);
}

const renderLogin = (req, res) => {
  const activeView = 'login';
  res.render(activeView, {
    title: 'Вход в систему',
    activeView: activeView,
    user: req.user
  });
}

const renderUsers = (req, res, users) => {
  const activeView = 'users';
  res.render(activeView, {
    title: 'Управление пользователями',
    activeView: activeView,
    user: req.user,
    users: users
  });
}

const renderUser = (req, res, user) => {
  const activeView = 'user';
  res.render(activeView, {
    title: 'Редактирование пользователя',
    activeView: activeView,
    user: req.user,
    editUser: user
  });
}

module.exports.login = (req, res) => {
  if (req.method === 'GET') {
    renderLogin(req, res);
  }
}

module.exports.user = (req, res) => {
  let user = null;
  if (req.session.id) {
    // найти пользователя в БД
  }
  else {
    user = new User();
  }
  renderUser(req, res, user);
}

module.exports.logout = (req, res, next) => {
  req.session.token = '';
  req.logout();
  res.redirect('/');
}

module.exports.users = (req, res) => {
  const path = '/api/users';
  let options = {
    url: apiOptions.server + path,
    method: "POST",
    headers: {
      'x-access-token': req.session.token
    },
    json: true
  };

  request(options, (err, response, body) => {
    let users = [];
    if (err) {
      console.log(err);
    }
    else if (response.statusCode === 200) {
      for (let i = 0; i < body.length; i++) {
        users.push(body[i]);
      }
    }
    else {
      console.log(body);
    }
    renderUsers(req, res, users);
  });
}