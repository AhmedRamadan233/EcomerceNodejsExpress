const express = require("express");
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../services/usersServices");
// const {
//   getUserByIdValidator,
//   createUserValidator,
//   UpdateUserValidator,
//   DeleteUserValidator,
// } = require("../utils/validators/bransValidator");

// const subCategoriesRoute = require("./subUserRoutes");

const router = express.Router();

// router.use("/:UserId/subcategories", subCategoriesRoute);

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
