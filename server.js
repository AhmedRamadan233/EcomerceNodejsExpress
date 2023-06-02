const path = require("path");
// require package
const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

// required files
const ApiError = require("./utils/apiErrors");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/dbConnections");
const categoryRoute = require("./routes/categoryRoutes");
const subCategoryRoute = require("./routes/subCategoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

//connection with db
dbConnection();

// Middleware
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);


app.all("*", (req, res, next) => {
  const error = new ApiError(`Cannot find this route: ${req.originalUrl}`, 404);
  next(error);
});

// global handling error middlewaer for express
app.use(globalError);

// const PORT = process.env.PORT || 8080;
app.listen(8080, () => {
  console.log(`Server connected on port ${8080}`);
});

// Events => callback(err)
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error: ${err.name} | ${err.message}`);
  // eslint-disable-next-line no-undef
  server.close(() => {
    console.error(`shut down.......... `);

    process.exit(1); //shutdown
  });
});
