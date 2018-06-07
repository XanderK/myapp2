const env = process.env.NODE_ENV;

const development = {
  app: {
    port: 3000
  },
  db: {
    host: 'localhost',
    port: 27017,
    name: 'db'
  }
};

const productive = {
 app: {
   port: 3000
 },
 db: {
   host: 'localhost',
   port: 27017,
   name: 'test'
 }
};

const config = {
    development,
    productive
};

module.exports = config[env];