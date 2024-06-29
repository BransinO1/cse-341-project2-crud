const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true }
});

module.exports = mongoose.model('Item', itemSchema);
