const User = require('../api/models/user');
const config = require('../api/config');

const request = require('request');
const apiOptions = {
  server: config.server
};

const renderLogin = (req, res) => {
  const activeView = 'login';
  res.render(activeView, {
    title: 'Вход в систему',
    activeView: activeView
  });
}

const renderUsers = (req, res, users) => {
  const activeView = 'users';
  res.render(activeView, {
    title: 'Управление пользователями',
    activeView: activeView,
    users: users
  });
}

const renderUser = (req, res, user) => {
  const activeView = 'user';
  res.render(activeView, {
    title: 'Редактирование пользователя',
    activeView: activeView,
    user: user
  });
}

module.exports.login = (req, res) => {
  if (req.method === 'GET') {
    renderLogin(req, res);
  }
  else {
    const path = '/api/login';
    let options = {
      url: apiOptions.server + path,
      method: "POST",
      form: {
        name: req.body.name,
        password: req.body.password
      },
      json: true
    };
    request(options, (err, response, body) => {
      if (err) {
        req.app.token = '';
        console.log(err);
      }
      else if (response.statusCode === 200) {
        if(body.auth) req.app.token = body.token;
        else req.app.token = '';
      }
      res.redirect('/');
    });

  }
}

module.exports.user = (req, res) => {
  let user = null;
  if (req.params.id) {
    // найти пользователя в БД
  }
  else {
    user = new User();
  }
  renderUser(req, res, user);
}

module.exports.logout = (req, res, next) => {
  const path = '/api/logout';
  let options = {
    url: apiOptions.server + path,
    method: "POST"
  };

  request(options, (err, response, body) => {
    if (err) console.log(err);
    else if (response.statusCode === 200) {
      req.app.token = '';
      response.redirect('/');
    }
  });
}

module.exports.users = (req, res) => {
  const path = '/api/users';
  let options = {
    url: apiOptions.server + path,
    method: "POST",
    headers: {
      'x-access-token': req.app.token
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