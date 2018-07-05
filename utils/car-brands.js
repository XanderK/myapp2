const fs = require('fs');
const path = '/images/car-brands';
const fullPath = __dirname + '/../public' + path;

module.exports.allBrands = (callback) => {
  fs.readdir(fullPath, (err, files) => {
    if(err) return callback(err, null);
    let brands = [];
    files.forEach( file => {
      // Выделение названия бренда из имени файла с логотипом
      let brandName = file.slice(0, file.indexOf('-logo.png')).replace(/-/g, ' ');
      let filePath = path + '/' + file;
      brands.push({'name' : brandName, 'file' : filePath});
    });
    
  callback(null, brands.sort((a, b) => { 
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
  }));
  //callback(null, brands);
  });
}
