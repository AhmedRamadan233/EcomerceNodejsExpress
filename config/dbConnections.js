const mongoose = require("mongoose");

// const MONGO_URI = process.env.MONGO_URI;

// Database connection
const dbConnection = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect("mongodb://127.0.0.1:27017/Ecomerce", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((error) => {
      console.error("Error connecting to the database:", error);
    });
};

module.exports = dbConnection;
