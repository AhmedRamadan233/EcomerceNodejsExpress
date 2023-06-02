const express = require("express");
const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../services/productServices");
const {
  getProductByIdValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

// const subProductsRoute = require("./subProductRoutes");

const router = express.Router();

// router.use("/:ProductId/subProducts", subProductsRoute);

router
  .route("/")
  .get(getAllProducts)
  .post(createProductValidator, createProduct);

router
  .route("/:id")
  .get(getProductByIdValidator, getProductById)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
