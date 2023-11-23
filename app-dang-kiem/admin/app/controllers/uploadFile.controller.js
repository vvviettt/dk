const uploadFileMiddleware = require('../utils/uploadFile');
const readXlsxFile = require('read-excel-file/node');
const uploadFile = require('../models/uploadFile.model');
const { dateConvert } = require('../utils/convert');
const axios = require('axios').default;

exports.uploadFile = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);
    readXlsxFile(`app/public/excel/${req.file.filename}`).then((rows) => {
      rows.shift();
      rows.map((row) => {
        row[2] = `${row[2].split('/')[2]}:${row[2].split('/')[1]}:${row[2].split('/')[0]}`;
        row[5] = 0;
      });
      uploadFile.create(rows, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          let data = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows[i][0]);
          }
          // console.log("rowsLP: ", data);
          axios
            .post(`${process.env.API_URL}/api/employee/notification/infringes`, {
              licensePlate: data,
              key: `${process.env.KEY_NOTIFICATION}`,
            })
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
          res.redirect('/infringe');
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};
