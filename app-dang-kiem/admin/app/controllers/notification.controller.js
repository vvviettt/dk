const Notification = require('../models/notification.model');

exports.edit = (req, res) => {
  res.locals.status = req.query.status;
  Notification.findById((err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else
      res.render('notification', {
        notification: data,
        title: 'Cấu hình thông báo',
        Username: req.user.username,
      });
  });
};
// Create and Save a new notification
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.redirect('/notification?status=error');
  }
  const notification = new Notification({
    day_before_registry: req.body.day_before_registry,
    day_before_expired: req.body.day_before_expired,
    time: req.body.time,
    status: !req.body.status ? false : true,
  });
  Notification.updateById(notification, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/notification');
  });
};
