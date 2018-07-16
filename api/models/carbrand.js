// Марка
const mongoose = require('mongoose');

const carBrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('CarBrand', carBrandSchema);