const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// get all product
exports.getAllProducts = async (req, res) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
};

//product detail
  
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});
//create Product

exports.createProducts = catchAsyncErrors(async (req, res) => {
  const products = await Product.create(req.body);

  res.status(201).json({
    success: true,
    products,
  });
});
//update Product

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  //let keyword use because we need to modify product

  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//delete product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  //let keyword use because we need to modify product
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
});
