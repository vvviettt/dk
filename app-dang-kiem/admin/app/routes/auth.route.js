const login = require('../controllers/auth/login.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const forgotPassword = require('../controllers/auth/forgotPassword.controller');

module.exports = (app) => {
  var router = require('express').Router();

  router
    .get('/login', authMiddleware.isAuth, login.showLoginForm)
    .post('/login', login.login)

    .get('/logout', authMiddleware.loggedin, login.logout)

    .get('/password/reset', forgotPassword.showForgotForm)
    .post('/password/email', forgotPassword.sendResetLinkEmail)

    .get('/password/reset/:email', forgotPassword.showResetForm)
    .post('/password/reset', forgotPassword.reset);

  app.use(router);
};
