// Эемент каталога
const mongoose = require('mongoose');
const userSchema = require('./User').schema;
const carModelSchema = require('./CarModel').schema;

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  model: { type: carModelSchema, required: true, index: true },
  engine: String,
  year: { type: Number, required: true, index: true },
  //isPart: { type: Boolean, required: true, default: true, index: true },
  created: { type: Date, required: true, default: Date.now },
  description: String,
  owner: { type: userSchema, required: true, index: true },
  responsible: String,
  images: [String],
  mainImageIndex: Number
});

module.exports = mongoose.model('Product', productSchema);