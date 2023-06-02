// const { request } = require('express');
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getSubCategoryByIdValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Field Of Name Is Empty")
    .isLength({ min: 3 })
    .withMessage("Too Short SubCategory Name")
    .isLength({ max: 32 })
    .withMessage("Too Loong SubCategory Name"),
  check("category")
    .notEmpty()
    .withMessage("Field Of categoryID Is Empty")
    .isMongoId()
    .withMessage("Invalid SubCategory Id Format"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  check("name")
    .notEmpty()
    .withMessage("Field Of Name Is Empty")
    .isLength({ min: 3 })
    .withMessage("Too Short SubCategory Name")
    .isLength({ max: 32 })
    .withMessage("Too Loong Category Name"),
  // check("category").notEmpty().withMessage("Field Of categoryID Is Empty")
  //   .isMongoId().withMessage("Invalid SubCategory Id Format"),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id Format"),
  validatorMiddleware,
];
