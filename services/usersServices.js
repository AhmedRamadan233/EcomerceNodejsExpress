const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require("../utils/apiErrors");
const ApiFeatures = require("../utils/apiFeatures");

// @des Get all User
// @route get /api/vi/Users
// @access Public
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  // build Query
  const documentCount = await User.countDocuments();
  const apiFeatures = new ApiFeatures(User.find(), req.query)
    .filters()
    .paginate(documentCount)
    .sort()
    .limitFields()
    .search();

  const { mongooseQuery, paginationResults } = apiFeatures;
  const getAllUsers = await mongooseQuery;
  res.status(200).json({
    paginationResults,
    length: getAllUsers.length,
    getAllUsers,
  });
});

// @des Get User by id
// @route get /api/vi/Users/:id
// @access Public
exports.getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const getUserById = await User.findById(id);
  if (!getUserById) {
    return next(new ApiError(`User with this id ${id} not found`, 404));
  }
  res.json(getUserById);
});

// @des Create User
// @route POST /api/vi/Users
// @access Private
exports.createUser = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  const createUser = await User.create(req.body);
  res.status(201).json({ data: createUser });
});
// @des Update User
// @route PUT /api/vi/User/:id
// @access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.name);
  const updateUser = await User.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!User) {
    return next(new ApiError(`User with this id ${id} not found`, 404));
  }
  res.json(updateUser);
});

// @des Delete User
// @route PUT /api/vi/User/:id
// @access Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleteUser = await User.findByIdAndDelete(id);
  if (!deleteUser) {
    return next(new ApiError(`User with this id ${id} not found`, 404));
  }
  res.json({ data: "deleted sucessfuly" });
});
