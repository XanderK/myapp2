const env = process.env.NODE_ENV || 'development';

const development = {
  db: {
    host: 'localhost',
    name: 'carparts-test',
  },
  //strategy: 'local'
  //secret: '(+*|~=qNI9_LJa*IVa;8Fc&r"2PYc$s0LUXD|L73H^6mdlfL2f][y$eg%HTS$iA'

};

const productive = {
  db: {
    host: 'localhost',
    name: 'carparts'
  },
  //strategy: 'local'
  //secret: '(+*|~=qNI9_LJa*IVa;8Fc&r"2PYc$s0LUXD|L73H^6mdlfL2f][y$eg%HTS$iA'
};

const config = {
    development,
    productive
};

module.exports = config[env];