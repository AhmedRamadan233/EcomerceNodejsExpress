const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Product name is required"],
      minlength: [3, "Too short title"],
      maxlength: [100, "Too long title"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Too short description"],
    },

    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },

    sold: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [20, "Product price should not exceed 20 characters"],
    },

    priceAfterDiscount: {
      type: Number,
      trim: true,
      max: [20, "Product price after discount should not exceed 20 characters"],
    },

    color: [String],

    imageCover: {
      type: String,
      required: [true, "Product imageCover is required"],
      trim: true,
      maxlength: [200, "Product image URL should not exceed 200 characters"],
    },

    images: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    subcategories: {
      type: [mongoose.Schema.ObjectId],
      ref: "subCategories",
    },
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "must be greater than 1"],
      max: [5, "must be less than 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


productSchema.post("init",  (doc)=> {
  if (doc.imageCover) {
    const imgCoverUrl = `http://localhost:8080/products/${doc.imageCover}`;
    doc.imageCover = imgCoverUrl;
  }

  if (doc.images && doc.images.length > 0) {
    doc.images = doc.images.map((image) => {
      const imgUrl = `http://localhost:8080/products/${image}`;
      return imgUrl;
    });
  }
});


productSchema.post("save",  (doc)=> {
  if (doc.imageCover) {
    const imgUrl = `http://localhost:8080/products/${doc.imageCover}`;
    doc.imageCover = imgUrl;
  }
  if (doc.images && doc.images.length > 0) {
    doc.images = doc.images.map((image) => {
      const imgUrl = `http://localhost:8080/products/${image}`;
      return imgUrl;
    });
  }
});
;



const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
