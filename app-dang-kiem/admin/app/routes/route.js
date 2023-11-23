module.exports = (app) => {
  require('./auth.route')(app);
  require('./category.route')(app);
  require('./type.route')(app);
  require('./infringe.route')(app);
  require('./management.route')(app);
  require('./pay.route')(app);
  require('./checked.route')(app);
  require('./fee.route')(app);
  require('./notification.route')(app);
  require('./uploadFile.route')(app);
  require('./staff.route')(app);
  require('./deadline.route')(app);
  require('./registered.route')(app);
  require('./profile.route')(app);
  require('./other.route')(app);
  require('./role.route')(app);
};
