var mongoose = require('mongoose');
var User = require('../models/user');
var helpers = require('../helpers');

module.exports.createUser = function(req, res) {
    //console.log(req.body);
    User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        created: req.body.created, 
    }).then(user => { 
        console.log(user);
        helpers.sendJSONresponse(res, 201, user);
    }).catch(err => {
        console.log(err);
        helpers.sendJSONresponse(res, 400, err);
    });
}

