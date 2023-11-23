const multer = require('multer');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
const maxSize = 20 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + '/app/public/excel');
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '-' + Date.now() + '.xlsx');
  },
});

let uploadFile = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.fieldname !== 'excel') {
      return cb(null, false);
    }
    cb(null, true);
    // return cb(new Error("ko load dc file"));
  },
  limits: { fileSize: maxSize },
}).single('excel');

let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;
