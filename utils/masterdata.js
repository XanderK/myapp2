// Заполнение справочнков марок и моделей авто
const fs = require('fs');
const CarBrand = require('../api/models/CarBrand');
const CarModel = require('../api/models/CarModel');
const fileName = __dirname + '/data/cars_csv.csv'

// загрузка марок и моделей из файла
const readCarData = (fileName, callback) => {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) throw new Error(err);
    let cars = [];
    const rows = data.split('\n');
    for(let i = 0; i < rows.length; i++) {
      let carData = rows[i].split(';');
      if (carData[0].length > 0) {
        //callback({ brand: carData[0], model: carData[1], startYear: carData[2], finishYear: carData[3] !== '-' ? carData[3] : null });
        cars.push({ brand: carData[0], model: carData[1], startYear: carData[2], finishYear: carData[3] !== '-' ? carData[3] : null });
      }
    }
    callback(cars.sort((a, b) => {
      if (a.brand < b.brand) return -1;
      if (a.brand > b.brand) return 1;
      return 0;
    }));
  });
}

// загрузка справочников в БД
module.exports.uploadMasterData = () => {
  console.log("Initial masterdata import from " + fileName);
  readCarData(fileName, cars => {
    CarBrand.find({}).then(async (carBrands) => {
      let storedCarBrands = carBrands.slice();
      
      // добавление марки авто бд
      for (let i = 0; i < cars.length; i++) {
        if (storedCarBrands.find(x => x.name === cars[i].brand) === undefined) {
          let carBrand = new CarBrand({ name: cars[i].brand });
          await carBrand.save().then(newCarBrand => {
            storedCarBrands.push(newCarBrand);
          }).catch(err => {
            throw new Error(err)
          });
        }
      }

      // добавление моделей в БД
      CarModel.find({}).then(carModels => {
        let storedCarModels = carModels.slice();
        for (let i = 0; i < cars.length; i++) {
          if (storedCarModels.find(x => x.name === cars[i].model) === undefined) {
            let carModel = new CarModel({ name: cars[i].model });
            carModel.brand = storedCarBrands.find(x => x.name === cars[i].brand);
            carModel.startYear = cars[i].startYear;
            carModel.finishYear = cars[i].finishYear;
            carModel.save().catch(err => {
              throw new Error(err)
            });
          }
        }
      }).catch(err => {
        throw new Error(err)
      });
    
    }).catch(err => {
      throw new Error(err)
    });

  });
}

//uploadMasterData();
//process.exit(0);