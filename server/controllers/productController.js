const catchAsyncError = require("../middlewares/catchAsyncError");
const Product = require("../models/productModel");
const ErrorHandler = require('../utils/errorHandler');
const Apifeatures = require('../utils/apiFeatures');

exports.getProducts = async (req, res, next) => {

  const restPerPage = 3;
  const apifeatures = new Apifeatures(Product.find(), req.query).search().filter().paginate(restPerPage);
  const products = await apifeatures.query;
  // return next(new ErrorHandler('Unable to send products!', 400))
  
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
};

exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return
    next(new ErrorHandler('Product not Found test', 400));
  }

  res.status(200).json({
    success: true,
    product,
  });
};

// create product - /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
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

//Create Review - api/v1/review
//Create Review - api/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
  const { productId, rating, comment } = req.body;

  const review = {
    user: req.user.id,
    rating,
    comment
  }

  const product = await Product.findById(productId);
  //finding user review exists
  const isReviewed = product.reviews.find(review => {
    return review.user.toString() == req.user.id.toString()
  })

  if (isReviewed) {
    //updating the  review
    product.reviews.forEach(review => {
      if (review.user.toString() == req.user.id.toString()) {
        review.comment = comment
        review.rating = rating
      }

    })

  } else {
    //creating the review
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  //find the average of the product reviews
  product.ratings = product.reviews.reduce((acc, review) => {
    return review.rating + acc;
  }, 0) / product.reviews.length;
  product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true
  })

})

//GET reviews - api/v1/reviews?id={product}
exports.getReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
})

//delete reviews - api/v1/reviews?id={product}
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);


  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
})

exports.abi = (req, res, next) => {
  res.status(201).json({
    success: true,
    message: " we made it our first api",
  });
};



