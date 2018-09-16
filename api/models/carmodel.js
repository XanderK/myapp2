// Модель
const mongoose = require('mongoose');
const carBrandSchema = require('./CarBrand').schema;

const carModelSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  brand: { type: carBrandSchema, required: true, index: true },
  startYear: { type: Number, required: true },
  finishYear: {type: Number } 
});

carModelSchema.index({brand: 1, name: 1}, {unique: true});

module.exports = mongoose.model('CarModel', carModelSchema);