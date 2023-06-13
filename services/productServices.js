const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Product = require("../models/productModel");
const ApiError = require("../utils/apiErrors");
const ApiFeatures = require("../utils/apiFeatures");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");


exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProducrImages = asyncHandler(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) {
    return next(new ApiError("No image files provided", 400));
  }

  const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/products/${imageCoverFileName}`);

  // Save the image file name in the request body
  req.body.imageCover = imageCoverFileName;
  // to save url
  // req.body.imageCover = req.hostname + imageCoverFileName;

  const imagesFileName = `product-${uuidv4()}-${Date.now()}-images.jpeg`;
  const resizedImages = [];

  for (let i = 0; i < req.files.images.length; i++) {
    const image = req.files.images[i];
    const resizedFileName = `product-${uuidv4()}-${Date.now()}-image-${
      i + 1
    }.jpeg`;

    // eslint-disable-next-line no-await-in-loop
    await sharp(image.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${resizedFileName}`);

    resizedImages.push(resizedFileName);
    // to save url
    // resizedImages.push(req.hostname + resizedFileName);
  }

  // Save the image file names in the request body
  req.body.images = resizedImages;

  next();
});

// @des Get all Product
// @route get /api/vi/categories
// @access Public
// Inside your route handler
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const documentCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .filters()
    .paginate(documentCount)
    .sort()
    .limitFields()
    .search("Product");

  const { mongooseQuery, paginationResults } = apiFeatures;
  const getAllProducts = await mongooseQuery
    .populate({ path: "category", select: "name -_id" })
    .populate({ path: "subcategories", select: "name -_id" })
    .populate({ path: "brand", select: "name -_id" });

  res.status(200).json({
    paginationResults,
    length: getAllProducts.length,
    getAllProducts,
  });
});

// @des Get Product by id
// @route get /api/vi/categories/:id
// @access Public
exports.getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const getProductById = await Product.findById(id)
    .populate({ path: "category", select: "name -_id" })
    .populate({ path: "subcategories", select: "name -_id" })
    .populate({ path: "brand", select: "name -_id" });

  if (!getProductById) {
    return next(new ApiError(`Product with this id ${id} not found`, 404));
  }
  res.json(getProductById);
});

// @des Create Product
// @route POST /api/vi/categories
// @access Private
exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  const createProduct = await Product.create(req.body);
  res.status(201).json({ data: createProduct });
});

// @des Update Product
// @route PUT /api/vi/Product/:id
// @access Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const updateProduct = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!updateProduct) {
    return next(new ApiError(`Product with this id ${id} not found`, 404));
  }
  res.json(updateProduct);
});

// @des Delete Product
// @route PUT /api/vi/Product/:id
// @access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleteProduct = await Product.findByIdAndDelete(id);
  if (!deleteProduct) {
    return next(new ApiError(`Product with this id ${id} not found`, 404));
  }
  res.json({ data: "deleted sucessfuly" });
});

// @des Get all Product
// @route get /api/vi/categories
// @access Public
// exports.getAllProducts = asyncHandler(async (req, res, next) => {
// // 1)filtering products
// // eslint-disable-next-line node/no-unsupported-features/es-syntax
// const queryStringObj = { ...req.query };
// const excludesField = ["page", "sort", "limit", "fields", "search"];
// excludesField.forEach((field) => delete queryStringObj[field]);

// // applay filter usin ggte|gt|lte|lt
// let queryStr = JSON.stringify(queryStringObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

// // 2)pagination
// const pages = req.query.pages * 1 || 1;
// const limit = req.query.limit * 1 || 5;
// const skip = (pages - 1) * limit;

// bild query
// let mongooseQuery = Product.find(JSON.parse(queryStr))
// .skip(skip)
// .limit(limit)
// .populate({ path: "category", select: "name -_id" })
// .populate({ path: "subcategories", select: "name -_id" })
// .populate({ path: "brand", select: "name -_id" });

// // 3)sorting
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(",").join(" ");
//   mongooseQuery = mongooseQuery.sort(sortBy);
// } else {
//   mongooseQuery = mongooseQuery.sort("-createdAt");
// }

// // 4) filter limiting
// if (req.query.fields) {
//   const fields = req.query.fields.split(",").join(" ");
//   mongooseQuery = mongooseQuery.select(fields);
// } else {
//   mongooseQuery = mongooseQuery.select("-createdAt");
// }

// // 5) search featchers
// if (req.query.search) {
//   const search = req.query.search.split(",").join(" ");
//   mongooseQuery = mongooseQuery.find({
//     $or: [
//       { title: { $regex: search, $options: "i" } },
//       { description: { $regex: search, $options: "i" } },
//     ],
//   });
// }

// const getAllProducts = await mongooseQuery;

// res.status(200).json({ data: getAllProducts.length, pages, getAllProducts });
// });
