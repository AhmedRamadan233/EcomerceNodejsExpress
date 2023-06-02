const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory Must Be Uique"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory Must Be Belong To Parent Category"],
    },
  },
  { timestamps: true }
);

const subCategoriesModel = mongoose.model("subCategories", subCategorySchema);

module.exports = subCategoriesModel;
