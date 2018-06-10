const env = process.env.NODE_ENV;

const development = {
  db: {
    host: 'localhost',
    name: 'carparts-test',
  }
};

const productive = {
 db: {
   host: 'localhost',
   name: 'carparts'
 }
};

const config = {
    development,
    productive
};

module.exports = config[env];