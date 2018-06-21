const User = require('../api/models/user');

const request = require('request');
var apiOptions = {
    server : "http://localhost:3000"
  };

var renderLogin = function(req, res) {
  const activeView = 'login';
  res.render(activeView, { 
    title: 'Вход в систему',
    activeView: activeView
  });
}

var renderUsers = function(req, res)
{
  const activeView = 'users';
  res.render(activeView, { 
    title: 'Управление пользователями',
    activeView: activeView,
    users: users
  });
}

var renderUser = function(req, res, user)
{
  const activeView = 'user';
  res.render(activeView, { 
    title: 'Редактирование пользователя',
    activeView: activeView,
    user: user
  });
}

module.exports.login = (req, res) => {
   renderLogin(req, res);
}

module.exports.user = (req, res) => {
  let user = null;
  if(req.params.id)
  {
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
    url : apiOptions.server + path,
    method : "POST",
    json : {},
    qs : {}
  };
  
  request(options, (err, response, body) => {
    let data = body;
    if(err) {
      console.log(err);
    }
    else if (response.statusCode === 200) {
      response.redirect('/');
    }
  });
}

module.exports.users = (req, res) => {
  const path = '/api/users';
  let options = {
    url : apiOptions.server + path,
    method : "POST",
    json : req.body,
    qs : {}
  };
  
  request(options, (err, response, body) => {
      let data = body;
      let users = new Array();
      if(err) {
        console.log(err);
      }
      else if (response.statusCode === 200) {
        for (let i=0; i<data.length; i++) {
          users.push(data[i]);
        }
      }
      else {
        console.log(body);
      }
      renderUsers(req, res);
    }
  );
}