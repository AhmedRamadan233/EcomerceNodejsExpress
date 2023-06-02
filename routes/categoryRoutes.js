const express = require("express");

const {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryServices");
const {
  getCategoryByIdValidator,
  createCategoryValidator,
  UpdateCategoryValidator,
  DeleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const subCategoriesRoute = require("./subCategoryRoutes");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoriesRoute);

router
  .route("/")
  .get(getAllCategories)
  .post(
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryByIdValidator, getCategoryById)
  .put(UpdateCategoryValidator, updateCategory)
  .delete(DeleteCategoryValidator, deleteCategory);

module.exports = router;
