const Category = require('../models/category.model');
const Money = require('../utils/convert');
const uploadFileMiddleware = require('../utils/uploadFile');
const readXlsxFile = require('read-excel-file/node');
// Show form create category
exports.create = (req, res) => {
  res.locals.status = req.query.status;

  res.render('category/create', {
    title: 'Thêm mới chủng loại phương tiện',
    Username: req.user.username,
  });
};
// Create and Save a new category
exports.store = (req, res) => {
  // Validate request
  if (!req.body) {
    res.redirect('/category/create?status=error');
  }
  // Create a category
  const category = new Category({
    name: req.body.name,
    tariff: Money.convertMoney(req.body.tariff),
    license_fee: Money.convertMoney(req.body.license_fee),
  });
  // Save category in the database
  Category.create(category, (err, data) => {
    if (err) res.redirect('/category/create?status=error');
    else res.redirect('/category');
  });
};
// Retrieve all category from the database (with condition).
exports.findAll = (req, res) => {
  res.locals.deleted = req.query.deleted;
  const title = req.query.title;
  Category.getAll(title, (err, data) => {
    if (err) res.redirect('/500');
    else
      res.render('category/index', {
        category: data,
        title: 'Chủng loại phương tiện',
        Username: req.user.username,
      });
  });
};

// Find a single category with a id
exports.edit = (req, res) => {
  res.locals.status = req.query.status;

  Category.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else
      res.render('category/edit', {
        category: data,
        title: 'Chỉnh sửa',
        Username: req.user.username,
      });
  });
};
// Update a category identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.redirect('/category/edit/' + req.params.id + '?status=error');
  }
  const category = new Category({
    name: req.body.name,
    tariff: Money.convertMoney(req.body.tariff),
    license_fee: Money.convertMoney(req.body.license_fee),
  });

  Category.updateById(req.params.id, category, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/category');
  });
};
// Delete a category with the specified id in the request
exports.delete = (req, res) => {
  Category.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/category');
  });
};
// Delete all category from the database.
exports.deleteAll = (req, res) => {
  Category.removeAll((err, data) => {
    if (err) res.redirect('/500');
    else res.redirect('/category?deleted=true');
  });
};

// find all published category
exports.findAllPublished = (req, res) => {
  Category.getAllPublished((err, data) => {
    if (err) res.redirect('/500');
    else res.render('category/index', { category: data });
  });
};

exports.uploadFile = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);
    readXlsxFile(`app/public/excel/${req.file.filename}`).then((rows) => {
      rows.shift();
      rows.map((row) => {
        row[1] = Money.convertMoney(row[1]);
        row[2] = Money.convertMoney(row[2]);
      });
      Category.uploadFile(rows, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          let data = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows[i][0]);
          }
          res.redirect('/category');
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};
