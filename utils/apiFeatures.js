class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filters() {
    // 1) Filtering products
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryStringObj = { ...this.queryString };
    const excludesField = ["page", "sort", "limit", "fields", "search"];
    excludesField.forEach((field) => delete queryStringObj[field]);

    // Apply filters using gte|gt|lte|lt
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  paginate(countDocuments) {
    const pages = this.queryString.pages * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (pages - 1) * limit;
    const endText = pages * limit;

    // Pagination Results
    const pagination = {};
    pagination.currentPage = pages;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);
    pagination.totalItems = countDocuments;

    // Next Page
    if (endText < countDocuments) {
      pagination.next = pages + 1;
    }
    if (skip > 0) {
      pagination.prev = pages - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResults = pagination;
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-createdAt");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.search) {
      let query = {};
      if (modelName === "Product") {
        query.$or = [
          { title: { $regex: this.queryString.search, $options: "i" } },
          { description: { $regex: this.queryString.search, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.search, $options: "i" } };
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }
}

module.exports = ApiFeatures;