const request = require('request');
var apiOptions = {
    server : "http://localhost:3000"
  };

module.exports.getAllUsers = function(req, res) {
  const path = '/api/users';
  let options = {
    url : apiOptions.server + path,
    method : "GET",
    json : {},
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

      activeView = 'users';
      res.render(activeView, { 
        title: 'Управление пользователями',
        activeView: activeView,
        users: users
      });
    }
  );
}