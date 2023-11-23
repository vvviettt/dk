const Management = require('../models/management.model');
const Car = require('../utils/convert');
const axios = require('axios').default;

exports.create = (req, res) => {
  res.locals.status = req.query.status;
  Management.getTypes(null, (err, data) => {
    if (err) res.redirect('/500');
    else
      res.render('management/create', {
        types: data,
        title: 'Thêm mới',
        Username: req.user.username,
      });
  });
};
exports.errorLicensePlate = (req, res) => {
  let invalid = false;
  const license_plate = Car.convertCar(req.body.license_plate);
  if (!req.body) {
    res.redirect('/management/create?status=error');
  } else {
    if (license_plate) {
      Management.findByLicensePlate(license_plate, (err, data1) => {
        if (data1 != null && data1.length) {
          invalid = true;
        }
        if (invalid) {
          const conflictError =
            'Xe có lỗi vi phạm chưa được xử lý, bạn có chắc chắn đăng ký đăng kiểm?';
          return res.send({ conflictError });
        } else {
          const conflictError = 'Xác nhận lưu đăng ký đăng kiểm?';
          return res.send({ conflictError });
        }
      });
    } else {
      const conflictError = 'Vui lòng nhập thông tin!!!';
      return res.send({ conflictError });
    }
  }
};
exports.store = (req, res) => {
  const management = new Management({
    owner_name: req.body.owner_name,
    owner_phone: req.body.owner_phone,
    date: Car.dateConvertSQL(req.body.date),
    is_pay: 0,
    vehicle_type_id: req.body.vehicle_type_id,
    testing_center_id: req.body.testing_center_id,
    address: req.body.address,
    license_plate: Car.convertCar(req.body.license_plate).toUpperCase(),
  });
  Management.create(management, (err, data) => {
    if (err) res.redirect('/management/create?status=error');
    else res.redirect('/management');
  });
};
exports.findAll = (req, res) => {
  res.locals.deleted = req.query.deleted;
  const dateConvert = (d) => {
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const start = Car.filterDateStartConvertSQL(req.query.daterange);
  const end = Car.filterDateEndConvertSQL(req.query.daterange);
  Management.getAll(start, end, (err, data) => {
    if (err) res.redirect('/500');
    else
      res.render('management/index', {
        management: {
          items: data,
          dateConvert,
          licensePlateConvert: Car.convertLicensePlate,
        },
        user: req.user,
        title: 'Quản lý đăng kiểm',
        Username: req.user.username,
        daterange: !req.query.daterange ? '' : req.query.daterange,
        functions: req.functions['0'],
      });
  });
};
exports.edit = (req, res) => {
  res.locals.status = req.query.status;
  Management.getTypes(null, (err, data1) => {
    Management.findById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.redirect('/404');
        } else {
          res.redirect('/500');
        }
      } else
        res.render('management/edit', {
          management: data,
          types: data1,
          title: 'Chỉnh sửa',
          Username: req.user.username,
        });
    });
  });
};
exports.content = (req, res) => {
  Management.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else
      res.render('management/content', {
        management: data,
        title: 'Chi tiết',
        Username: req.user.username,
        functions: req.functions['0'],
      });
  });
};
exports.update = (req, res) => {
  if (!req.body) {
    res.redirect('/management/edit/' + req.params.id + '?status=error');
  }
  const management = new Management({
    id: req.body.id,
    owner_name: req.body.owner_name,
    owner_phone: req.body.owner_phone,
    date: Car.dateConvertSQL(req.body.date),
    is_pay: 0,
    vehicle_type_id: req.body.vehicle_type_id,
    testing_center_id: req.body.testing_center_id,
    address: req.body.address,
    license_plate: Car.convertCar(req.body.license_plate).toUpperCase(),
  });
  Management.updateById(req.params.id, management, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/management');
  });
};

exports.payed = (req, res) => {
  // console.log('req bill: ', req.body);
  const bill = [
    Car.convertMoney(req.body.fee_5),
    Car.convertMoney(req.body.fee_6),
    Car.convertMoney(req.body.fee_7),
  ];
  Management.updatePay(req.params.id, bill, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else {
      axios
        .post(`${process.env.API_URL}/api/employee/notification/payment`, {
          registryId: req.params.id,
          key: `${process.env.KEY_NOTIFICATION}`,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      res.redirect('/management');
    }
  });
};

exports.assignment = (req, res) => {
  // console.log('req: ', req.body);
  index = req.body.fooby.indexOf('1');
  const staff = new Management({
    staff_id: req.body.code[index],
    staff_name: req.body.fullName[index],
    car_delivery_time: req.body.time[index],
    date_birth: req.body.dateOfBirth[index],
    id_card: req.body.idCard[index],
    phone_number: req.body.phoneNumber[index],
  });
  Management.updateAssignment(req.params.id, staff, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else {
      // console.log('STAFF: ', req.body.code[index]);
      // console.log('STAFF: ', req.body.id);
      // console.log('STAFF req.body.staff_id: ', req.body.staff_id);

      axios
        .post(`${process.env.API_URL}/api/employee/notification/assignment`, {
          userName: req.body.code[index],
          registryId: req.body.id,
          oldUser: req.body.staff_id ? req.body.staff_id : '',
          key: `${process.env.KEY_NOTIFICATION}`,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });

      res.redirect('/management');
    }
  });
};

exports.delete = (req, res) => {
  Management.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/management');
  });
};
