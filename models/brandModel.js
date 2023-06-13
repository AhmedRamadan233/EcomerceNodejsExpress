const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name is unique"],
    },

    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
BrandSchema.post('init' ,  (doc)=>{
  //set image url or base url + name
  if(doc.image){
    const imgUrl = `http://localhost:8080/brands/${doc.image}`;
    doc.image = imgUrl;
  }
});

BrandSchema.post('save' ,  (doc)=>{
  //set image url or base url + name
  if(doc.image){
    const imgUrl = `http://localhost:8080/brands/${doc.image}`;
    doc.image = imgUrl;
  }
});
const BrandModel = mongoose.model("Brand", BrandSchema);

module.exports = BrandModel;
