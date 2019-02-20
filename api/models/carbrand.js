// Марка
const mongoose = require('mongoose');
//const carModelSchema = require('./CarModel').schema;

const CarBrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  //models: [carModelSchema]
});

module.exports = mongoose.model('CarBrand', CarBrandSchema);