const passport = require('passport')
//var mongoose = require('mongoose');
const User = require('../models/user');
const helpers = require('../helpers');

/*
module.exports.createUser = (req, res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        created: Date.now(),
    }).then(user => { 
        helpers.sendJSONresponse(res, 201, user);
    }).catch(err => {
        console.log(err);
        helpers.sendJSONresponse(res, 400, err);
    });
}
*/

module.exports.getAllUsers = (req, res) => {
    User.find().then(users => { 
        helpers.sendJSONresponse(res, 200, users);
    }).catch( err => {
        console.log(err);
        helpers.sendJSONresponse(res, 400, err);
    });
}

module.exports.registerUser = (req, res) => {
    User.register(new User({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        created: Date.now()
    }), 
    req.body.password,
    (err, user) => {
        if (err) {
            console.log(err);
            helpers.sendJSONresponse(res, 400, err);
            //return res.render('register', { account : account });
        }
        else {
            /*
            passport.authenticate('local')(req, res, () => {
                req.session.save((err) => {
                    if (err) {
                        console.log(err);
                        helpers.sendJSONresponse(res, 400, err);
                    }
                    else {
                        helpers.sendJSONresponse(res, 200, user);
                    }
                });
            });
            */
           passport.authenticate('local', { failureRedirect: '/login' },  (req, res) => res.redirect('/'));
        }
    });
}
