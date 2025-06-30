const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please enter product name"],
    maxLength: [100, "Product name cannot exceed 100 characters"],
  },
  price: {
    type: Number,
    default: 100,
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  ratings: {
    type: String,
    default: 0,
  },
  images: [
    {
      imageName: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter product category"],
    enum: {
      values: [
        "Food",
        "Books",
        "Laptops",
        "Electronics",
        "Mobile Phones",
        "HeadPhpones",
        "Outdooor",
        "home",
        "Sports",
      ],
      message: "Please select correct category",
    },
  },
  seller: {
    type: String,
    required: [true, "Please enter product seller"],
  },
  stock: {
    type: Number,
    required: [true, "please enter product stock"],
    max: [20, "stock must be below or equal to 20"],
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
      },
      rating: {
        type: String,
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
    default: Date.now(),
  },
});

const schema = mongoose.model("product", productSchema);

module.exports = schema;
