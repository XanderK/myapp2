const mongoose = require( 'mongoose' );
const passportLocalMongoose = require('passport-local-mongoose');
const config = require('../config')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String },
  role: { type: String, required: true },
  created: { type: Date, required: true }
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'name', usernameLowerCase: true});

const User = mongoose.model('User', userSchema);

// Cоздание пользователя для администрирования, если такового нет
let username = 'admin';
User.findOne({
  name: username
}).then( user => {
  if(user == null) {
    User.register(new User({
      name: username,
      created: Date.now(),
      role: 'admin'}),
      '123456').catch(err => {
        console.log(err);  
      });
    }
}).catch(err => {
  console.log(err);  
});

// Cоздание пользователя для защиты точек API, если такового нет
username = 'guest';
User.findOne({
  name: username
}).then( user => {
  if(user == null) {
    User.register(new User({
      name: username,
      created: Date.now(),
      role: 'guest'}),
      config.guest_password).catch(err => {
        console.log(err);  
      });
    }
}).catch(err => {
  console.log(err);  
});

module.exports = User;