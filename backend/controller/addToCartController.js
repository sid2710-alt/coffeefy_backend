const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const AddToCart = require('../model/addToCartModel')


// get all added product
exports.getAllCart = async (req, res) => {
    const products = await AddToCart.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  };

 //create Product

exports.addtoCart = catchAsyncErrors(async (req, res) => {
    const products = await AddToCart.create(req.body);
  
    res.status(201).json({
      success: true,
      products,
    });
  });


//delete product

exports.removeToCart = catchAsyncErrors(async (req, res, next) => {
    //let keyword use because we need to modify product
    let product = await AddToCart.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    await product.remove();
  
    res.status(200).json({
      success: true,
      message: "product deleted successfully",
    });
  });
  