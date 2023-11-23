const Pay = require('../models/pay.model');
const Car = require('../utils/convert');
const axios = require('axios').default;

// Show form create pay

exports.findAll = (req, res) => {
  res.locals.deleted = req.query.deleted;
  const dateConvert = (d) => {
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };
  const testingCenter = !req.query.center ? '' : req.query.center;
  const start = !req.query.daterange ? '' : Car.filterDateStartConvertSQL(req.query.daterange);
  const end = !req.query.daterange ? '' : Car.filterDateEndConvertSQL(req.query.daterange);
  Pay.getAll(testingCenter, start, end, (err, data) => {
    Pay.getCenter((err, data1) => {
      if (err) res.redirect('/500');
      else
        res.render('pay/index', {
          pay: { items: data, dateConvert, licensePlateConvert: Car.convertLicensePlate },
          center: data1,
          title: 'Đã thu tiền',
          Username: req.user.username,
          daterange: !req.query.daterange ? '' : req.query.daterange,
          testingCenter: !req.query.center ? '' : req.query.center,
          functions: req.functions['1'],
        });
    });
  });
};
exports.findCenter = (req, res) => {
  res.locals.deleted = req.query.deleted;

  Pay.getCenter((err, data) => {
    if (err) res.redirect('/500');
    else
      res.render('pay/index', { center: data, title: 'Đã thu tiền', Username: req.user.username });
  });
};
// Find a single pay with a id
exports.edit = (req, res) => {
  res.locals.status = req.query.status;

  Pay.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.render('pay/edit', { pay: data, title: 'Chỉnh sửa', Username: req.user.username });
  });
};

exports.content = (req, res) => {
  Pay.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else
      res.render('pay/content', {
        pay: data,
        title: 'Chi tiết',
        Username: req.user.username,
        functions: req.functions['1'],
      });
  });
};
// Update a pay identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.redirect('/pay/edit/' + req.params.id + '?status=error');
  }
  Pay.updateById(req.params.id, new Pay(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/pay/edit/' + req.params.id + '?status=success');
  });
};

exports.updateSubstandard = (req, res) => {
  Pay.updateStatus(req.params.id, new Pay(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else {
      axios
        .post(`${process.env.API_URL}/api/employee/notification/complete`, {
          registryId: req.params.id,
          type: '0',
          key: `${process.env.KEY_NOTIFICATION}`,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      res.redirect('/pay');
    }
  });
};
exports.updateQualified = (req, res) => {
  Pay.updateStatusQualified(req.params.id, new Pay(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else {
      axios
        .post(`${process.env.API_URL}/api/employee/notification/complete`, {
          registryId: req.params.id,
          type: '1',
          key: `${process.env.KEY_NOTIFICATION}`,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      res.redirect('/pay');
    }
  });
};
