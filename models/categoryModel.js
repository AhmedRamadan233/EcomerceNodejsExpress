const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name is unique"],
    },

    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

CategorySchema.post("init", (doc) => {
  //set image url or base url + name
  if (doc.image) {
    const imgUrl = `http://localhost:8080/categories/${doc.image}`;
    doc.image = imgUrl;
  }
});

CategorySchema.post("save", (doc) => {
  //set image url or base url + name
  if (doc.image) {
    const imgUrl = `http://localhost:8080/categories/${doc.image}`;
    doc.image = imgUrl;
  }
});

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
