// Модель
const mongoose = require('mongoose');
const CarBrandSchema = require('./CarBrand').schema;

const CarModelSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  brand: { type: CarBrandSchema, required: true, index: true },
  startYear: { type: Number, required: true },
  finishYear: {type: Number } 
});

CarModelSchema.index({brand: 1, name: 1}, {unique: true});

module.exports = mongoose.model('CarModel', CarModelSchema);