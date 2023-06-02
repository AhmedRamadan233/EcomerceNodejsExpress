const express = require("express");
const {
  getAllSubCategories,
  createSubCategory,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilter,
} = require("../services/subCategoryServices");
const {
  createSubCategoryValidator,
  getSubCategoryByIdValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

// mergeparams allow us to access parames on anothe routers
// ex we need to acces categoryid from category router
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilter, getAllSubCategories)
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory);

router
  .route("/:id")
  .get(getSubCategoryByIdValidator, getSubCategoryById)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
