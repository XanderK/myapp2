const CarBrand = require('../models/CarBrand');
const CarModel = require('../models/CarModel');
const helpers = require('../helpers');

module.exports.allCarBrands = (req, res) => {
  CarBrand.find().then(carBrands => {
    helpers.sendJSONresponse(res, 200, carBrands);
  }).catch(err => {
    console.error(err);
    helpers.sendJSONresponse(res, 400, err);
  });
}

module.exports.allCarModels = (req, res) => {
  CarModel.find().then(carModels => {
    helpers.sendJSONresponse(res, 200, carModels);
  }).catch(err => {
    console.error(err);
    helpers.sendJSONresponse(res, 400, err);
  });
}