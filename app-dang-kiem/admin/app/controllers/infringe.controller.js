const Infringe = require('../models/infringe.model');
const Car = require('../utils/convert');
const LicensePlate = require('../utils/convert');
const axios = require('axios').default;

// Show form create infringe
exports.create = (req, res) => {
  res.locals.status = req.query.status;
  res.render('infringe/create', { title: 'Thêm mới', Username: req.user.username });
};
// Create and Save a new infringe
exports.store = (req, res) => {
  // Validate request
  if (!req.body) {
    res.redirect('/infringe/create?status=error');
  }

  // Create a infringe
  // console.log(req.boby.status);
  const infringe = new Infringe({
    infringe_date: Car.dateConvertSQL(req.body.infringe_date),
    license_plate: Car.convertCar(req.body.license_plate).toUpperCase(),
    violator_name: req.body.violator_name,
    infringes_name: req.body.infringes_name,
    handling_agency: req.body.handling_agency,
    status: req.body.status == 0 ? false : true,
  });
  // Save infringe in the database
  Infringe.create(infringe, (err, data) => {
    if (err) res.redirect('/infringe/create?status=error');
    else {
      let result = [infringe.license_plate];
      // for (let i = 0; i < infringe.length; i++) {
      //   data.push(infringe[i][0]);
      // }
      // console.log("67890: ", result);
      axios
        .post(`${process.env.API_URL}/api/employee/notification/infringes`, {
          licensePlate: result,
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
};
// Retrieve all infringe from the database (with condition).
exports.findAll = (req, res) => {
  res.locals.deleted = req.query.deleted;
  Infringe.getAll((err, data) => {
    if (err) res.redirect('/500');
    else {
      res.render('infringe/index', {
        infringe: data,
        licensePlateConvert: LicensePlate.convertLicensePlate,
        infringeDateConvert: LicensePlate.dateConvert,
        title: 'Phương tiện có lỗi vi phạm',
        Username: req.user.username,
      });
    }
  });
};

// Find a single infringe with a id
exports.edit = (req, res) => {
  res.locals.status = req.query.status;

  Infringe.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else
      res.render('infringe/edit', {
        infringe: data,
        title: 'Chỉnh sửa',
        Username: req.user.username,
      });
  });
};
// Update a infringe identified by the id in the request
exports.update = (req, res) => {
  const infringe = new Infringe({
    name: req.body.name,
    infringe_date: Car.dateConvertSQL(req.body.infringe_date),
    license_plate: Car.convertCar(req.body.license_plate).toUpperCase(),
    violator_name: req.body.violator_name,
    infringes_name: req.body.infringes_name,
    handling_agency: req.body.handling_agency,
    status: req.body.status == 0 ? false : true,
  });
  // Validate Request
  if (!req.body) {
    res.redirect('/infringe/edit/' + req.params.id + '?status=error');
  }
  Infringe.updateById(req.params.id, infringe, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/infringe');
  });
};
// Delete a infringe with the specified id in the request
exports.delete = (req, res) => {
  Infringe.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/infringe');
  });
};
// Delete all infringe from the database.
exports.deleteAll = (req, res) => {
  Infringe.removeAll((err, data) => {
    if (err) res.redirect('/500');
    else res.redirect('/infringe?deleted=true');
  });
};
