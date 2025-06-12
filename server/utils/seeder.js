const connectDatabase = require("../config/database");
const products = require("../data/products.json");
const Product = require("../models/productModel");
const dotenv = require("dotenv");

dotenv.config({ path: "server/config/config.env" });
connectDatabase();

const seederProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("all data deleted successfully");
    await Product.insertMany(products);
    console.log("all data inserted successfully");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

seederProducts();
