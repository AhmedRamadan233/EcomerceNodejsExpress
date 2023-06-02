const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const SubCategory = require("../models/subCategoriesModel");
const ApiError = require("../utils/apiErrors");
const ApiFeatures = require("../utils/apiFeatures");

exports.createFilter = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};

exports.getAllSubCategories = asyncHandler(async (req, res, next) => {
  // build Query
  const documentCount = await SubCategory.countDocuments();
  const apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
    .filters()
    .paginate(documentCount)
    .sort()
    .limitFields()
    .search();

  const { mongooseQuery, paginationResults } = apiFeatures;
  const getAllSubCategories = await mongooseQuery;
  // .populate({ path: "category", select: "name -_id" });

  res.status(200).json({
    paginationResults,
    length: getAllSubCategories.length,
    getAllSubCategories,
  });
});

exports.getSubCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const getSubCategory = await SubCategory.findById(id);
  //   .populate({
  //     path: "category",
  //     select: "name -_id",
  //   });
  if (!getSubCategory) {
    return next(new ApiError(`subCategory with this id ${id} not found`, 404));
  }
  res.json(getSubCategory);
});

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createSubCategory = asyncHandler(async (req, res, next) => {
  if (!req.body.Category) req.body.Category = req.params.categoryId;

  const { name, category } = req.body;
  const createSubCategories = await SubCategory.create({
    name,
    category,
    slug: slugify(name),
  });
  res.status(201).json({ data: createSubCategories });
});

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const updatedSubCategory = await SubCategory.findByIdAndUpdate(
    id,
    { name, slug: slugify(name), category },
    { new: true }
  );
  if (!updatedSubCategory) {
    return next(new ApiError(`SubCategory with id ${id} not found`, 404));
  }
  res.json(updatedSubCategory);
});

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleteSubCategories = await SubCategory.findByIdAndDelete(id);
  if (!deleteSubCategories) {
    return next(new ApiError(`SubCategory with this id ${id} not found`, 404));
  }
  res.json({ data: "deleted sucessfuly" });
});
