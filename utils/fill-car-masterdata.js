// Заполнение справочнков марок и моделей авто
const fs = require('fs');
const fileName = './data/cars_csv.csv'
require('../api/db');
const CarBrand = require('../api/models/carbrand');
const CarModel = require('../api/models/carmodel');

// загрузка марок и моделей из файла
function readCarData(fileName, callback) {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) throw err;
    let cars = [];
    data.split('\n').forEach(value => {
      let carData = value.split(';');
      if (carData[0].length > 0) {
        //callback({ brand: carData[0], model: carData[1], startYear: carData[2], finishYear: carData[3] !== '-' ? carData[3] : null });
        cars.push({ brand: carData[0], model: carData[1], startYear: carData[2], finishYear: carData[3] !== '-' ? carData[3] : null });
      }
    });
    callback(cars);
  });
}

// сохранение справочников в БД
function saveToDatabase() {
  readCarData(fileName, cars => {
    CarBrand.find({}, (err, items) => {
      if(err) return console.log(err);
      let brands = [];
      items.forEach(item => brands.push(item.name));
      cars.forEach(car => {
        if(brands.indexOf(car.brand) < 0) {
          try{
            let brand = new CarBrand({name : car.brand});
            brand.save((err, entity) => {
              if(err) throw new Error(err); 
            });
            brands.push(brand.name);
          }
          catch(err) {
            console.log(err);
          }
        }
      });      
    });
  });
}

saveToDatabase();