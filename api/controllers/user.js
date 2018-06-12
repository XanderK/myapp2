var mongoose = require('mongoose');
var User = require('../models/user');

//api/locations
module.exports.createUser = function(req, res) {
    console.log(req.body);
    User.create({

    });
}

//var user = new User({name: 'Alexander'});
//module.exports = user;