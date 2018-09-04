const CarBrand = require('../models/CarBrand');

module.exports.allCarBrands = (req, res) => {
  CarBand.find().then(carBrands => {
    helpers.sendJSONresponse(res, 200, carBrands);
  }).catch(err => {
    console.error(err);
    helpers.sendJSONresponse(res, 400, err);
  });
}