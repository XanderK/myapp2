const env = process.env.NODE_ENV || 'development';

const development = {
  server: 'http://localhost:3000',
  db: {
    host: 'localhost',
    name: 'carparts-test'
  },
  default_admin_password: '123456',  
  default_guest_password: 'mn$/Qw.V>2u7D)AP',
  secret: 'wSr@j=6Y+=$%?ppm!RXAEUzw?zyX-tPGRQWLABpc_zeST=@Zkb-Dddq5^U?deP?F',
  product_images_dir: 'data/files'
};

const production = {
  server: 'http://localhost:3000',
  db: {
    host: 'mongo',
    name: 'carparts'
  },
  default_admin_password: '123456',
  default_guest_password: 'mn$/Qw.V>2u7D)AP',
  secret: 'wSr@j=6Y+=$%?ppm!RXAEUzw?zyX-tPGRQWLABpc_zeST=@Zkb-Dddq5^U?deP?F',
  product_images_dir: 'data/files'
};

const config = {
    development,
    production
};

module.exports = config[env];