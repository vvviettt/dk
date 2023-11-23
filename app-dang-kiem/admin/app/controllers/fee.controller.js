const Fee = require('../models/fee.model');
const Money = require('../utils/convert');

// Show form create fee
exports.create = (req, res) => {
  res.locals.status = req.query.status;
  Fee.getCategories(null, (err, data) => {
    if (err) res.redirect('/500');
    else res.render('fee/create', { fee: data, title: 'Thêm mới', Username: req.user.username });
  });
};
// Create and Save a new fee
exports.store = (req, res) => {
  // Validate request
  if (!req.body) {
    res.redirect('/fee/create?status=error');
  }

  // Create a fee
  let data1 = [];
  if (typeof req.body.from === 'string') {
    data1.push([req.body.from, req.body.to, Money.convertMoney(req.body.fee)]);
  } else {
    for (let i = 0; i < req.body.from.length; i++) {
      data1.push([req.body.from[i], req.body.to[i], Money.convertMoney(req.body.fee[i])]);
    }
  }

  // Save fee in the database
  Fee.removeAll((err, data) => {
    Fee.create(data1, (err, data) => {
      if (err) res.redirect('/fee/create?status=error');
      else res.redirect('/fee');
    });
  });
};
// Retrieve all fee from the database (with condition).
exports.findAll = (req, res) => {
  res.locals.deleted = req.query.deleted;
  Fee.getAll(null, (err, data) => {
    if (err) res.redirect('/500');
    else
      res.render('fee/index', {
        fee: data,
        title: 'Cấu hình phí đăng kiểm hộ',
        Username: req.user.username,
      });
  });
};
exports.update = (req, res) => {
  Fee.updateById(req.params.id, new Fee(), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/fee');
  });
};
exports.delete = (req, res) => {
  Fee.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/fee');
  });
};

exports.deleteAll = (req, res) => {
  Fee.removeAll((err, data) => {
    if (err) res.redirect('/500');
    else res.redirect('/fee?deleted=true');
  });
};
