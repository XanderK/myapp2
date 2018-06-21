const mongoose = require('mongoose');
const config = require('./config');

let gracefulShutdown;
const dbUri = 'mongodb://' + config.db.host + '/' + config.db.name;
//const dbUri = 'mongodb+srv://test:OiCfD9NVvBZeu03m@cluster0-5d1tq.mongodb.net/test'

if (process.env.NODE_ENV === 'production') {
  dbUri = process.env.MONGOLAB_URI;
}

mongoose.connect(dbUri, { autoIndex: false }).catch(err => {
  console.log(err);
})

// CONNECTION EVENTS
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to ' + dbUri);
});
mongoose.connection.on('error', err => {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};
// For nodemon restarts
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});
// For Heroku app termination
process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app termination', () => {
    process.exit(0);
  });
});

// BRING IN YOUR SCHEMAS & MODELS
require('./models/user');

//module.exports.mongooseConnection = mongoose.connection;
