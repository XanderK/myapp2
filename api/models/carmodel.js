// Модель
const mongoose = require('mongoose');
const carBrandSchema = require('./carbrand').schema;

const carModelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  brand: carBrandSchema,
  startYear: { type: Number, required: true },
  finishYear: { type: Number }
});

module.exports = mongoose.model('CarModel', carModelSchema);