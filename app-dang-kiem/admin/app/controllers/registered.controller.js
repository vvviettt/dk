const Registered = require('../models/registered.model');
const LicensePlate = require('../utils/convert');

exports.findAll = (req, res) => {
  res.locals.deleted = req.query.deleted;
  const dateConvert = (d) => {
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const status = !req.query.status ? '' : req.query.status;
  const start = !req.query.daterange
    ? ''
    : LicensePlate.filterDateStartConvertSQL(req.query.daterange);
  const end = !req.query.daterange ? '' : LicensePlate.filterDateEndConvertSQL(req.query.daterange);
  Registered.getAll(status, start, end, (err, data) => {
    if (err) res.redirect('/500');
    else
      res.render('registered/index', {
        registered: {
          items: data,
          dateConvert,
          licensePlateConvert: LicensePlate.convertLicensePlate,
        },
        status: !req.query.status ? '' : req.query.status,
        daterange: !req.query.daterange ? '' : req.query.daterange,
        title: `Báo cáo số xe đăng kiểm`,
        Username: req.user.username,
      });
  });
};
