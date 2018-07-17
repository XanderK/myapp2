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
async function saveMasterData() {
  readCarData(fileName, cars => {
    CarBrand.find({}).then(items => {
      let brands = {};

      // добавление марок авто
      items.forEach(item => brands[item.name] = item._id);
      await cars.forEach(car => {
        if (brands[car.brand] === 'undefined') {
          let brand = new CarBrand({ name: car.brand });
          brand.save()
            .then(savedBrand => brands[savedBrand.name] = savedBrand._id)
            .catch(err => {
              throw new Error(err)
            });
        }
      });

      // добавление моделей авто

    }).catch(err => {
      throw new Error(err);
    });
  });
}

saveMasterData();