const Deadline = require('../models/deadline.model');
const Car = require('../utils/convert');

exports.findAll = (req, res) => {
  res.locals.deleted = req.query.deleted;
  const dateConvert = (d) => {
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };
  // console.log("date: ", req.query.date);
  // console.log("dateConvert: ", Car.dateConvertSQL1(req.query.date));
  const date = Car.dateConvertSQL1(req.query.date);
  const value = req.query.value;
  Deadline.getAll(date, value, (err, data) => {
    if (err) res.redirect('/500');
    else {
      const date = Car.dateConvert1(req.query.date);
      res.render('deadline/index', {
        date1: date,
        value,
        deadline: {
          items: data,
          dateConvert,
          licensePlateConvert: Car.convertLicensePlate,
        },
        title: 'Báo cáo phương tiện sắp tới hạn đăng kiểm',
        Username: req.user.username,
      });
    }
  });
};
