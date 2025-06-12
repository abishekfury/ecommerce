const express = require("express");
const {
  getProducts,
  abi,
  newProduct,
  getSingleProduct,
  updateProduct,
  productDelete,
} = require("../controllers/productController");
const router = express.Router();
const { isAuthenticatedUser , authorizeRoles } = require ('../middlewares/authenticate');

router.route("/products").get(isAuthenticatedUser , getProducts);

router.route("/product/:id").get(getSingleProduct);

router.route("/product/:id").put(updateProduct);

router.route("/product/:id").delete(productDelete)

router.route("/product/new").post( isAuthenticatedUser , authorizeRoles ('admin') , newProduct);

router.route("/abishek").get(abi);

module.exports = router;

