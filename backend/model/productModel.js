const mongoose = require("mongoose");

const productScheama = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the product Name"],
  },
  description: {
    type: String,
    required: [true, "Please enter the product Description"],
  },
  price: {
    type: Number,
    required: [true, "Please enter the product Price"],
    maxlength: [8, "price can not exceed 8 character"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      }, //image host in cloud navi
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter product category"],
  },
  stock: {
    type: Number,
    required: [true, "please enter the stock"],
    maxlength: [4, "stock can not exceed"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productScheama);
