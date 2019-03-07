// Эемент каталога
const mongoose = require('mongoose');
const UserSchema = require('./User').schema;
const ImageSchema = require('./Image').schema;
const CarModelSchema = require('./CarModel').schema;

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  model: { type: CarModelSchema, required: true, index: true },
  engine: String,
  year: { type: Number, required: true, index: true },
  //isPart: { type: Boolean, required: true, default: true, index: true },
  created: { type: Date, required: true, default: Date.now },
  description: String,
  owner: { type: UserSchema, required: true, index: true },
  responsible: String,
  //images: [String],
  images: [ImageSchema],
  mainImageIndex: Number
});

module.exports = mongoose.model('Product', ProductSchema);