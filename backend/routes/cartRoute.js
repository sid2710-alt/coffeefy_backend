const express = require("express");
const { getAllCart, addtoCart, removeToCart } = require("../controller/addToCartController");

const router = express.Router();

router.route('/cart').get(getAllCart)
router.route('/cart').post(addtoCart)
router.route('/cart/:id').delete(removeToCart)

module.exports = router;