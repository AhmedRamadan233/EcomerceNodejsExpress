// require Package
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

// require filesystem
const Category = require("../models/categoryModel");
const ApiError = require("../utils/apiErrors");
const { uploadImage } = require("../middlewares/uploadImageMiddleware");

// eslint-disable-next-line import/extensions
const ApiFeatures = require("../utils/apiFeatures.js");

exports.uploadCategoryImage = uploadImage("image");
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No image file provided", 400));
  }
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);

  // Save the image file name in the request body
  req.body.image = fileName;

  next();
});

// @des Get all category
// @route get /api/vi/categories
// @access Public
exports.getAllCategories = asyncHandler(async (req, res, next) => {
  // build Query
  const documentCount = await Category.countDocuments();
  const apiFeatures = new ApiFeatures(Category.find(), req.query)
    .filters()
    .paginate(documentCount)
    .sort()
    .limitFields()
    .search();

  const { mongooseQuery, paginationResults } = apiFeatures;
  const getAllCategories = await mongooseQuery;
  res.status(200).json({
    paginationResults,
    length: getAllCategories.length,
    getAllCategories,
  });
});

// @des Get category by id
// @route get /api/vi/categories/:id
// @access Public
exports.getCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError(`Category with this id ${id} not found`, 404));
  }
  res.json(category);
});

// @des Create category
// @route POST /api/vi/categories
// @access Private
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, image } = req.body;
  const category = await Category.create({ name, slug: slugify(name), image });
  res.status(201).json({ data: category });
});

// @des Update category
// @route PUT /api/vi/category/:id
// @access Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, image } = req.body;
  const category = await Category.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), image }, // Update both name and slug fields
    { new: true }
  );
  if (!category) {
    return next(new ApiError(`Category with this id ${id} not found`, 404));
  }
  res.json(category);
});

// @des Delete category
// @route PUT /api/vi/category/:id
// @access Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(`Category with this id ${id} not found`, 404));
  }
  res.json({ data: "deleted sucessfuly" });
});

// memoy Storage
// const multerStorage = multer.memoryStorage();

// filters
// const multerFilter = (req, file, callback) => {
//   if (file.mimetype.startsWith("image")) {
//     callback(null, true);
//   } else {
//     callback(new ApiError(`Only images are allowed`, 404));
//   }
// };
// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// exports.uploadCategoryImage = upload.single("image");

// DiskStorage
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "uploads/categories");
//   },
//   filename: function (req, file, callback) {
//     const extension = file.mimetype.split("/")[1];
// const fileName = `category-${uuidv4()}-${Date.now()}.${extension}`;
//     callback(null, fileName);
//   },
// });
