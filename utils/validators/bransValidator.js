const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getBrandByIdValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Format"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Field Of Name Is Empty")
    .isLength({ min: 3 })
    .withMessage("Too Short Brand Name")
    .isLength({ max: 32 })
    .withMessage("Too Loong Brand Name"),
  validatorMiddleware,
];

exports.UpdateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Format"),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Field Of Name Is Empty")
    .isLength({ min: 3 })
    .withMessage("Too Short Brand Name")
    .isLength({ max: 32 })
    .withMessage("Too Loong Brand Name"),
  validatorMiddleware,
];

exports.DeleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id Format"),
  validatorMiddleware,
];
