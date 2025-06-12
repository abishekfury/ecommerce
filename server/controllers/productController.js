const catchAsyncError = require("../middlewares/catchAsyncError");
const Product = require("../models/productModel");
const ErrorHandler = require('../utils/errorHandler');
const Apifeatures = require('../utils/apiFeatures')

exports.getProducts = async (req, res, next) => {

  const restPerPage = 2;
  const apifeatures = new Apifeatures(Product.find(), req.query).search().filter().paginate(restPerPage);
  const fetchProducts = await apifeatures.query;
  
  res.status(200).json({
    success: true,
    count: fetchProducts.length,
    fetchProducts,
  });
};

exports.getSingleProduct = async (req, res, next) => {
  const fetchSingleProduct = await Product.findById(req.params.id);

  if (!fetchSingleProduct) {
    return  
        next(new ErrorHandler('Product not Found test', 400));
  }

  res.status(200).json({
    success: true,
    fetchSingleProduct,
  });
};

// create product - /api/v1/product/new
exports.newProduct = catchAsyncError ( async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(202).json({
    success: true,
    product,
  });
});

exports.updateProduct = async (req, res, next) => {
  let getUpdateById = await Product.findById(req.params.id);

  if (!getUpdateById) {
    return res.status(404).json({
      success: false,
      message: "prodcut not found",
    });
  }

  getUpdateById = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    getUpdateById,
  });
};

exports.productDelete = async (req, res, next) => {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deleteProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deleteProduct,
    });
  };

exports.abi = (req, res, next) => {
  res.status(201).json({
    success: true,
    message: " we made it our first api",
  });
};



  