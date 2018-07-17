// Марка
const mongoose = require('mongoose');
const carModelSchema = require('./modelbrand').schema;

const carBrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  models: [carModelSchema]
});

module.exports = mongoose.model('CarBrand', carBrandSchema);