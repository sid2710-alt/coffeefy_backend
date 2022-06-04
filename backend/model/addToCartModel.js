const mongoose = require('mongoose')

const addToCartScheama = new mongoose.Schema({

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
      images:  {
            type: String,
            required: true,
          },
      category: {
        type: String,
        required: [true, "Please enter product category"],
      }
})


module.exports = mongoose.model("AddToCart", addToCartScheama);