const env = process.env.NODE_ENV || 'development';

const development = {
  server: 'http://localhost:3000',
  db: {
    host: 'localhost',
    name: 'carparts-test'
  },
  guest_password: 'mn$/Qw.V>2u7D)AP',
  secret: 'wSr@j=6Y+=$%?ppm!RXAEUzw?zyX-tPGRQWLABpc_zeST=@Zkb-Dddq5^U?deP?F'
};

const productive = {
  server: 'http://localhost:3000',
  db: {
    host: 'localhost',
    name: 'carparts'
  },
  guest_password: 'mn$/Qw.V>2u7D)AP',
  secret: 'wSr@j=6Y+=$%?ppm!RXAEUzw?zyX-tPGRQWLABpc_zeST=@Zkb-Dddq5^U?deP?F'
};

const config = {
    development,
    productive
};

module.exports = config[env];