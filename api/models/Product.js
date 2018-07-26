const mongoose = require('mongoose');
const carModelSchema = require('./CarModel').schema;
const userSchema = require('./User').schema;

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  model: { type: carModelSchema, required: true, index: true },
  subModel: { type: String, required: true },
  year: { type: Number, required: true, indax: true },
  isPart: { type: Boolean, required: true, default: true, index: true },
  created: { type: Date, required: true },
  description: String,
  owner: { type: userSchema, required: true, index: true }
});

module.exports = mongoose.model('Product', productSchema);