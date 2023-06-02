const express = require("express");
const {
  getAllBrands,
  createBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require("../services/brandServices");
const {
  getBrandByIdValidator,
  createBrandValidator,
  UpdateBrandValidator,
  DeleteBrandValidator,
} = require("../utils/validators/bransValidator");

// const subCategoriesRoute = require("./subBrandRoutes");

const router = express.Router();

// router.use("/:BrandId/subcategories", subCategoriesRoute);

router
  .route("/")
  .get(getAllBrands)
  .post(createBrandValidator, createBrand);

router
  .route("/:id")
  .get(getBrandByIdValidator, getBrandById)
  .put(UpdateBrandValidator, updateBrand)
  .delete(DeleteBrandValidator, deleteBrand);

module.exports = router;
