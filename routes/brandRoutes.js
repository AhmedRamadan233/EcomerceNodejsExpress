const express = require("express");
const {
  getAllBrands,
  createBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
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
  .post(uploadBrandImage, resizeImage, createBrandValidator, createBrand);

router
  .route("/:id")
  .get(getBrandByIdValidator, getBrandById)
  .put(uploadBrandImage, resizeImage, UpdateBrandValidator, updateBrand)
  .delete(DeleteBrandValidator, deleteBrand);

module.exports = router;
