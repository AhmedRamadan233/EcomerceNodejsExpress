const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoriesModel");
const Brand = require("../../models/brandModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3 })
    .withMessage("Too short title")
    .isLength({ max: 100 })
    .withMessage("Too long title"),

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20 })
    .withMessage("Too short description"),

  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity is number"),

  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .trim()
    .isLength({ max: 20 })
    .withMessage("Product price should not exceed 20 characters"),

  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product price after discount must be a number")
    .trim()
    .isLength({ max: 20 })
    .withMessage(
      "Product price after discount should not exceed 20 characters"
    ),

  check("imageCover")
    .notEmpty()
    .withMessage("Product imageCover is required")
    .trim()
    .isLength({ max: 200 })
    .withMessage("Product image URL should not exceed 200 characters"),

  check("category")
    .notEmpty()
    .withMessage("Product must belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((categoryId) =>
      Category.findById(categoryId)
        .then((category) => {
          if (!category) {
            return Promise.reject(
              new Error(`No category found for this ID: ${categoryId}`)
            );
          }
        })
        .catch((error) => Promise.reject(error))
    ),
  check("brand")
    .notEmpty()
    .withMessage("Product must belong to a brand")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((brandId) =>
      Brand.findById(brandId)
        .then((brandResult) => {
          if (!brandResult) {
            return Promise.reject(
              new Error(`No brand found for this ID: ${brandId}`)
            );
          }
        })
        .catch((error) => Promise.reject(error))
    ),
  check("subcategories")
    .isArray()
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((subcategoriesId) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesId } })
        .then((subcategoryResult) => {
          if (
            subcategoryResult.length < 1 ||
            subcategoryResult.length !== subcategoriesId.length
          ) {
            return Promise.reject(
              new Error(`No category found for this ID: ${subcategoriesId}`)
            );
          }
        })
        .catch((error) => Promise.reject(error))
    )
    .custom((value, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subCategories) => {
          const subCategoriesIdsInDb = subCategories.map((subCategory) =>
            subCategory._id.toString()
          );
          const checker = value.every((v) => subCategoriesIdsInDb.includes(v));
          // console.log(checker);
          if (!checker) {
            return Promise.reject(
              new Error(`subcategories must belong to one of the category`)
            );
          }
        }
      )
    ),

  validatorMiddleware,
];
exports.getProductByIdValidator = [
  check("id").notEmpty().withMessage("Product ID is required"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").notEmpty().withMessage("Product ID is required"),
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short title")
    .isLength({ max: 100 })
    .withMessage("Too long title"),
  check("description")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Too short description"),
  check("quantity").optional(),
  check("price")
    .optional()
    .isNumeric()
    .withMessage("Product price must be a number")
    .trim()
    .isLength({ max: 20 })
    .withMessage("Product price should not exceed 20 characters"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product price after discount must be a number")
    .trim()
    .isLength({ max: 20 })
    .withMessage(
      "Product price after discount should not exceed 20 characters"
    ),
  check("imageCover").optional().trim().isLength({ max: 200 }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").notEmpty().withMessage("Product ID is required"),
  validatorMiddleware,
];
