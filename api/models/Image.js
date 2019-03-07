// Изображение продукта
const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  //id: { type: String, required: false, index: false },
  thumb: { type: String, required: false, index: false },
  full: { type: String, required: false, index: false }
});

module.exports = mongoose.model('Image', ImageSchema);