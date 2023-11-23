const Role = require('../models/role.model');
const bcrypt = require('bcrypt');
require('dotenv/config');
const mailer = require('../utils/mailer');

exports.store = (req, res) => {
  let data = [];
  for (let i = 0; i < 10; i++) {
    data.push([
      req.body.function_id[i],
      !req.body.create[i] ? false : true,
      !req.body.update[i] ? false : true,
      !req.body.delete[i] ? false : true,
      !req.body.read[i] ? false : true,
    ]);
  }
  Role.create(data, (err, data) => {
    if (!err) res.redirect('/role');
  });
};
exports.findAll = (req, res) => {
  res.locals.deleted = req.query.deleted;

  Role.getAll(null, (err, data) => {
    if (err) res.redirect('/500');
    else
      res.render('role/index', {
        role: data,
        title: 'Phân quyền nhân viên',
        Username: req.user.username,
      });
  });
};

// Find a single role with a id
exports.edit = (req, res) => {
  res.locals.status = req.query.status;

  Role.findByIdUser(req.params.id, (err, data) => {
    Role.findByIdUserFunction(req.params.id, (err, data1) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.redirect('/404');
        } else {
          res.redirect('/500');
        }
      } else
        res.render('role/staff', {
          info: data,
          role: data1,
          title: 'Phân quyền',
          Username: req.user.username,
        });
    });
  });
};
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.redirect('/role/staff/' + req.params.id + '?status=error');
  }
  let data = [];
  for (let i = 0; i < 10; i++) {
    data.push([
      req.body.id[i],
      req.body.function_id[i],
      req.params.id,
      req.body.create1[i],
      req.body.update1[i],
      req.body.delete1[i],
      req.body.read1[i],
    ]);
  }
  // console.log('data: ', data);
  Role.updateById(req.params.id, data, (err, data) => {
    if (!err) res.redirect('/role');
  });
};
