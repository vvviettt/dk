const authMiddleware = require('../middlewares/auth.middleware');
const { canViewProject } = require('../utils/roles');
module.exports = (app) => {
  const registered = require('../controllers/registered.controller');
  var router = require('express').Router();

  // Retrieve all registered
  router.get(
    '/',
    (req, res, next) => {
      if (!canViewProject(req.functions['7'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }
      next();
    },
    registered.findAll
  );

  app.use('/registered', authMiddleware.loggedin, router);
  app.get('/500', (req, res) => {
    res.render('err');
  });
  app.get('/404', (req, res) => {
    res.render('404');
  });
};
