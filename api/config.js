const env = process.env.NODE_ENV || 'development';

const development = {
  db: {
    host: 'localhost',
    name: 'carparts-test'
  },
  guest_password: 'mn$/Qw.V>2u7D)AP'
};

const productive = {
  db: {
    host: 'localhost',
    name: 'carparts'
  },
  guest_password: 'mn$/Qw.V>2u7D)AP'
};

const config = {
    development,
    productive
};

module.exports = config[env];