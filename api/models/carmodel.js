// Модель
const mongoose = require('mongoose');
const carBrandSchema = require('./CarBrand').schema;

const carModelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  brand: { type: carBrandSchema, required: true, index: true },
  startYear: { type: Number, required: true},
  finishYear: {type: Number} 
});

module.exports = mongoose.model('CarModel', carModelSchema);