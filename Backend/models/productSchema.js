const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  name: { type: String, require: true },
  sku: { type: String, require: true },
  quantity: { type: Number, require: true },
  price: { type: Number, require: true },
  created_at: { type: Date, default: Date.now },
});
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;