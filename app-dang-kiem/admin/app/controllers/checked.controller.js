const Checked = require('../models/checked.model');
const LicensePlate = require('../utils/convert');

// Retrieve all checked from the database (with condition).
exports.findAll = (req, res) => {
  res.locals.deleted = req.query.deleted;
  const dateConvert = (d) => {
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };
  const start = !req.query.daterange
    ? ''
    : LicensePlate.filterDateStartConvertSQL(req.query.daterange);
  const end = !req.query.daterange ? '' : LicensePlate.filterDateEndConvertSQL(req.query.daterange);
  Checked.getAll(start, end, (err, data) => {
    if (err) res.redirect('/500');
    else
      res.render('checked/index', {
        checked: {
          items: data,
          dateConvert,
          licensePlateConvert: LicensePlate.convertLicensePlate,
        },
        title: 'Đã đăng kiểm',
        Username: req.user.username,
        daterange: !req.query.daterange ? '' : req.query.daterange,
      });
  });
};

// Find a single checked with a id
exports.edit = (req, res) => {
  res.locals.status = req.query.status;

  Checked.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else
      res.render('checked/edit', {
        checked: {
          ...data,
          plan_date: data.plan_date ? data.plan_date : new Date('00:00:00'),
          payment_date: data.payment_date ? data.payment_date : new Date('00:00:00'),
        },
        title: 'Chỉnh sửa',
        Username: req.user.username,
      });
  });
};
exports.content = (req, res) => {
  Checked.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else
      res.render('checked/content', {
        checked: {
          ...data,
          plan_date: data.plan_date ? data.plan_date : new Date('00:00:00'),
          payment_date: data.payment_date ? data.payment_date : new Date('00:00:00'),
        },
        title: 'Chi tiết',
        Username: req.user.username,
      });
  });
};
exports.update = (req, res) => {
  res.locals.status = req.query.status;

  if (!req.body) {
    res.redirect('/checked/edit/' + req.params.id + '?status=error');
  }
  const checked = new Checked({
    id: req.body.id,
    status: req.body.status,
    plan_date: LicensePlate.dateConvertSQL(req.body.plan_date),
    payment_date: LicensePlate.dateConvertSQL(req.body.payment_date),
  });
  Checked.updateById(req.params.id, checked, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/checked');
  });
};
// Delete a checked with the specified id in the request
exports.delete = (req, res) => {
  Checked.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/checked');
  });
};
