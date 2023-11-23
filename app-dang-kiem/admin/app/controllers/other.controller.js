const Other = require('../models/other.model');

exports.edit = (req, res) => {
  Other.findById((err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else
      res.render('other', {
        other: data,
        title: 'Cấu hình khác',
        Username: req.user.username,
      });
  });
};
// Create and Save a new Other
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.redirect('/other?status=error');
  }
  const other = new Other({
    allowed_days: req.body.allowed_days,
    number_vehicles: req.body.number_vehicles,
  });
  Other.updateById(other, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/other');
  });
};
