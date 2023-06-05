
const multer = require('multer');

const ApiError = require('../utils/apiErrors');



exports.uploadImage = (filedName)=>{
const multerStorage = multer.memoryStorage();

// filters
const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new ApiError(`Only images are allowed`, 404));
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

return upload.single(filedName);
}
// memoy Storage