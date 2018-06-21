const mongoose = require( 'mongoose' );
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String },
  role: { type: String, required: true },
  created: { type: Date, required: true }
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'name', usernameLowerCase: true});

module.exports =  mongoose.model('User', userSchema);