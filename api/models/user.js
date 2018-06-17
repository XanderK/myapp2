var mongoose = require( 'mongoose' );
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  role: { type: String, required: true },
  created: Date
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'name', usernameLowerCase: true});

const User = mongoose.model('User', userSchema);

// Cоздание пользователя для администрирования, если такового нет
const username = 'admin';
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

module.exports = User;