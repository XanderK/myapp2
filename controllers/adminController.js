const request = require('request');
var apiOptions = {
    server : "http://localhost:3000"
  };

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
      next(response);
    }
  });
}

module.exports.getAllUsers = (req, res) => {
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

      activeView = 'users';
      res.render(activeView, { 
        title: 'Управление пользователями',
        activeView: activeView,
        users: users
      });
    }
  );
}