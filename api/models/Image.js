// Изображение продукта
const mongoose = require('mongoose');
const path = require('path');

const ImageSchema = new mongoose.Schema({
  thumb: { type: String, required: false, index: false },
  full: { type: String, required: false, index: false }
});

ImageSchema.virtual('key').get(() => {
  let key = "";
  if(this.full != null) {
    key = path.parse(this.full).name;
  }
  return key;
});

module.exports = mongoose.model('Image', ImageSchema);