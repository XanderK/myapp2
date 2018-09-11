// Пользователь
const mongoose = require( 'mongoose' );
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  phone: String,
  email: String,
  role: { type: String, required: true, index: true },
  created: { type: Date, required: true, default: Date.now }
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'name', usernameLowerCase: true});

module.exports =  mongoose.model('User', userSchema);