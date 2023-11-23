const Type = require('../models/type.model');
const Money = require('../utils/convert');
const uploadFileMiddleware = require('../utils/uploadFile');
const readXlsxFile = require('read-excel-file/node');
// Show form create type
exports.create = (req, res) => {
  res.locals.status = req.query.status;
  Type.getCategories(null, (err, data) => {
    // console.log(data);
    if (err) res.redirect('/500');
    else res.render('type/create', { type: data, title: 'Thêm mới', Username: req.user.username });
  });
};
// Create and Save a new type
exports.store = (req, res) => {
  // Validate request
  if (!req.body) {
    res.redirect('/type/create?status=error');
  }

  // Create a type
  const type = new Type({
    name: req.body.name,
    road_fee: Money.convertMoney(req.body.road_fee),
    vehicle_category_id: req.body.vehicle_category_id,
  });
  // Save type in the database
  Type.create(type, (err, data) => {
    if (err) res.redirect('/type/create?status=error');
    else res.redirect('/type');
  });
};
// Retrieve all type from the database (with condition).
exports.findAll = (req, res) => {
  res.locals.deleted = req.query.deleted;
  const name = req.query.name;
  Type.getAll(name, (err, data) => {
    if (err) res.redirect('/500');
    else
      res.render('type/index', {
        type: data,
        title: 'Phí bảo trì đường bộ',
        Username: req.user.username,
      });
  });
};

// Find a single type with a id
exports.edit = (req, res) => {
  res.locals.status = req.query.status;
  Type.getCategories(null, (err, data1) => {
    Type.findById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.redirect('/404');
        } else {
          res.redirect('/500');
        }
      } else
        res.render('type/edit', {
          category: data1,
          type: data,
          title: 'Chỉnh sửa Phí bảo trì đường bộ',
          Username: req.user.username,
        });
    });
  });
};
// Update a type identified by the id in the request
exports.update = (req, res) => {
  const type = new Type({
    name: req.body.name,
    road_fee: Money.convertMoney(req.body.road_fee),
    vehicle_category_id: req.body.vehicle_category_id,
  });
  // Validate Request
  if (!req.body) {
    res.redirect('/type/edit/' + req.params.id + '?status=error');
  }
  Type.updateById(req.params.id, type, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/type');
  });
};
// Delete a type with the specified id in the request
exports.delete = (req, res) => {
  Type.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/type');
  });
};
// Delete all type from the database.
exports.deleteAll = (req, res) => {
  Type.removeAll((err, data) => {
    if (err) res.redirect('/500');
    else res.redirect('/type?deleted=true');
  });
};

exports.uploadFile = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);
    readXlsxFile(`app/public/excel/${req.file.filename}`).then((rows) => {
      rows.shift();
      rows.map((row) => {
        row[2] = Money.convertMoney(row[2]);
      });
      Type.uploadFile(rows, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          let data = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows[i][0]);
          }
          res.redirect('/type');
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};
