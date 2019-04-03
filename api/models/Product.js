// Эемент каталога
const mongoose = require('mongoose');
const UserSchema = require('./User').schema;
const ImageSchema = require('./Image').schema;
const CarModelSchema = require('./CarModel').schema;
const DateTime = require('../../utils/DateTime');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  model: { type: CarModelSchema, required: true, index: true },
  engine: String,
  year: { type: Number, required: true, index: true },
  created: { type: Date, required: true, default: Date.now },
  description: String,
  owner: { type: UserSchema, required: true, index: true },
  responsible: String,
  images: [ImageSchema],
  mainImageIndex: Number
},
{
  toJSON: { virtuals: true }  
});

ProductSchema.virtual('createdText').get(function() {
  let createdText = "";
  if(this.created != null) {
    createdText = DateTime.toString(this.created);
  }
  return createdText;
});

ProductSchema.virtual('carModelText').get(function() {
  let carModelText = this.model.carModelText;
  if(this.engine) {
    carModelText = carModelText + ", " + this.engine;
  }
  carModelText = carModelText + ", " + this.year;
  return carModelText;
});

module.exports = mongoose.model('Product', ProductSchema);