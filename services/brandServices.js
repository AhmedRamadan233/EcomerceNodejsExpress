const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Brand = require("../models/brandModel");
const ApiError = require("../utils/apiErrors");
const ApiFeatures = require("../utils/apiFeatures");

const { uploadImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadBrandImage = uploadImage("image");
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No image file provided", 400));
  }
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);

  // Save the image file name in the request body
  req.body.image = fileName;

  next();
});

// @des Get all Brand
// @route get /api/vi/Brands
// @access Public
exports.getAllBrands = asyncHandler(async (req, res, next) => {
  // build Query
  const documentCount = await Brand.countDocuments();
  const apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .filters()
    .paginate(documentCount)
    .sort()
    .limitFields()
    .search();

  const { mongooseQuery, paginationResults } = apiFeatures;
  const getAllBrands = await mongooseQuery;
  res.status(200).json({
    paginationResults,
    length: getAllBrands.length,
    getAllBrands,
  });
});

// @des Get Brand by id
// @route get /api/vi/Brands/:id
// @access Public
exports.getBrandById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const getBrandById = await Brand.findById(id);
  if (!getBrandById) {
    return next(new ApiError(`Brand with this id ${id} not found`, 404));
  }
  res.json(getBrandById);
});

// @des Create Brand
// @route POST /api/vi/Brands
// @access Private
exports.createBrand = asyncHandler(async (req, res, next) => {
  const { name, image } = req.body;
  const createBrand = await Brand.create({
    name,
    slug: slugify(name),
    image,
  });
  res.status(201).json({ data: createBrand });
});

// @des Update Brand
// @route PUT /api/vi/Brand/:id
// @access Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, image } = req.body;
  const updateBrand = await Brand.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), image }, // Update both name and slug fields
    { new: true }
  );
  if (!Brand) {
    return next(new ApiError(`Brand with this id ${id} not found`, 404));
  }
  res.json(updateBrand);
});

// @des Delete Brand
// @route PUT /api/vi/Brand/:id
// @access Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleteBrand = await Brand.findByIdAndDelete(id);
  if (!deleteBrand) {
    return next(new ApiError(`Brand with this id ${id} not found`, 404));
  }
  res.json({ data: "deleted sucessfuly" });
});
