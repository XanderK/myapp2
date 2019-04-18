// Изображение продукта
const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  thumb: { type: String, required: false, index: false },
  full: { type: String, required: false, index: false }
});

module.exports = mongoose.model('Image', ImageSchema);