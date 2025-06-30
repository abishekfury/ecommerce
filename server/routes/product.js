const express = require("express");
const {
  getProducts,
  abi,
  newProduct,
  getSingleProduct,
  updateProduct,
  productDelete,
  createReview,
  getReviews,
} = require("../controllers/productController");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

router.route("/products").get(getProducts)
  .put(updateProduct)
  .delete(productDelete)

router.route("/product/:id").get(getSingleProduct)

router.route('/review').put(isAuthenticatedUser, createReview);

router.route('/reviews').put(getReviews);

router.route("/abishek").get(abi);

//Admin Routes
router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles('admin'), newProduct);

module.exports = router;

