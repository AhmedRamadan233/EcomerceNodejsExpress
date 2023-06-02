const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getCategoryByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Field Of Name Is Empty")
    .isLength({ min: 3 })
    .withMessage("Too Short Category Name")
    .isLength({ max: 32 })
    .withMessage("Too Loong Category Name"),
  validatorMiddleware,
];

exports.UpdateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  check("name")
    .notEmpty()
    .withMessage("Field Of Name Is Empty")
    .isLength({ min: 3 })
    .withMessage("Too Short Category Name")
    .isLength({ max: 32 })
    .withMessage("Too Loong Category Name"),
  validatorMiddleware,
];

exports.DeleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id Format"),
  validatorMiddleware,
];
