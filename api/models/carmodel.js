// Модель
const mongoose = require('mongoose');
const CarBrandSchema = require('./CarBrand').schema;

const CarModelSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  brand: { type: CarBrandSchema, required: true, index: true },
  startYear: { type: Number, required: true },
  finishYear: {type: Number } 
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true }     
});

CarModelSchema.index({brand: 1, name: 1}, {unique: true});

CarModelSchema.virtual('carModelText').get(function() {
  let carModelText = this.name;
  if(this.brand != null) {
    carModelText = this.brand.name + " " + carModelText;
  }
  return carModelText;
});

module.exports = mongoose.model('CarModel', CarModelSchema);