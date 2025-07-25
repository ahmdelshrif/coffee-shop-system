const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "category",
    required: [true, "اسم الصنف مطلوب"]
  },
  name: {
    type: String,
    required: [true, "اسم المنتج مطلوب"],
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    required: [true, "السعر مطلوب"],
    min: [0, "السعر لا يمكن أن يكون أقل من صفر"]
  },
  image: String,
  sold: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
