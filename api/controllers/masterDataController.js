const CarBrand = require('../models/CarBrand');
const CarModel = require('../models/CarModel');
const helpers = require('../helpers');

module.exports.allCarBrands = async (req, res) => {
  try { 
    const carBrands = await CarBrand.find();
    helpers.sendJSONresponse(res, 200, carBrands);
  }
  catch(e) {
    console.error(e);
    helpers.sendJSONresponse(res, 400, e);
  }
}

module.exports.allCarModels = async (req, res) => {
  try { 
    const carModels = await CarModel.find();
    helpers.sendJSONresponse(res, 200, carModels);
  }
  catch(e) {
    console.error(e);
    helpers.sendJSONresponse(res, 400, e);
  }
}