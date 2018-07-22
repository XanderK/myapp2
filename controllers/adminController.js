const passport = require('passport')
const jwt = require('jsonwebtoken');
const request = require('request');
const config = require('../api/config');
const User = require('../api/models/user');
const helpers = require('../api/helpers');

const apiOptions = {
  server: config.server
};

module.exports.authenticate = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { 
      console.error(err);
      return next(err); 
    }
    if (!user) { 
      console.log(info);
      return res.redirect('/admin/login'); }
    req.login(user, (err) => {
      if (err) { 
        console.error(err);
        return next(err);
      }
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

module.exports.logout = (req, res, next) => {
  req.session.token = '';
  req.logout();
  res.redirect('/');
}

module.exports.users = (req, res) => {
  const path = '/api/users';
  let options = {
    url: apiOptions.server + path,
    method: "GET",
    headers: {
      'x-access-token': req.session.token
    },
    json: true
  };

  request(options, (err, response, body) => {
    let users = [];
    if (err) {
      console.error(err);
    }
    else if (response.statusCode === 200) {
      for (let i = 0; i < body.length; i++) {
        users.push(body[i]);
      }
    }
    renderUsers(req, res, users);
  });
}

// страница регистрации нового пользователя
module.exports.newUser = (req, res) => {
  if(req.user) renderUser(req, res, null);
}

// страница редактирования пользователя
module.exports.editUser = (req, res) => {
  let userId = req.body.id
  if (userId) {
    const path = '/api/users/' + userId;
    let options = {
      url: apiOptions.server + path,
      method: "GET",
      headers: {
        'x-access-token': req.session.token
      },
      json: true
    };
  
    request(options, (err, response, body) => {
      if(err) { 
        helpers.sendJSONresponse(res, 400, err);
      }
      else if (response.statusCode === 200) {
        renderUser(req, res, body);
      }
      else {
        helpers.sendJSONresponse(res, response.statusCode, body);
      }
    })    
  }
  else {
    helpers.sendJSONresponse(res, 400, 'Bad request');
  }
}

// Создание пользователя через API
module.exports.createUser = (req, res) => {
  const path = '/api/users';
  let options = {
    url: apiOptions.server + path,
    method: "POST",
    headers: {
      'x-access-token': req.session.token
    },
    json: true,
    form: {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    }
  };

  request(options, (err, response, body) => {
    if(err) helpers.sendJSONresponse(res, 400, err);
    else res.redirect('/admin/users');
  })
}

// Обновление пользователя через API
module.exports.updateUser = (req, res) => {
  let userId = req.body.id
  if (userId) {
    const path = '/api/users';
    let options = {
      url: apiOptions.server + path,
      method: "PUT",
      headers: {
        'x-access-token': req.session.token
      },
      json: true,
      form: {
        id: userId,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password
      }
    };

    request(options, (err, response, body) => {
      if(err) { 
        helpers.sendJSONresponse(res, 400, err);
      }
      else if (response.statusCode === 200) {
        res.redirect('/admin/users');
      }
      else {
        helpers.sendJSONresponse(res, response.statusCode, body);
      }
    })    
  }
  else {
    helpers.sendJSONresponse(res, 400, 'Bad request');
  }
}

// Удаление пользователя через API
module.exports.deleteUser = (req, res) => {
  //helpers.sendJSONresponse(res, 200, req.body);
  const path = '/api/users';
  let options = {
    url: apiOptions.server + path,
    method: "DELETE",
    headers: {
      'x-access-token': req.session.token
    },
    json: true,
    form: {
      id: req.body.id
    }
  };

  request(options, (err, response, body) => {
    res.redirect('/admin/users');
  })

}
