const express = require("express");

const router = express.Router();

const {
  getAllProducts,
  createProducts,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controller/productController");
const { isAuthenticatedUser } = require("../middleware/auth");

//router.route("/products").get(isAuthenticatedUser, getAllProducts);
router.route("/products").get(getAllProducts);

router.route("/products/new").post(isAuthenticatedUser, createProducts);

router
  .route("/products/:id")
  .put(isAuthenticatedUser, updateProduct)
  .get(getProductDetails)
  .delete(isAuthenticatedUser, deleteProduct);

module.exports = router;
