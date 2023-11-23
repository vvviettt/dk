const authMiddleware = require('../middlewares/auth.middleware');
const {
  canCreateProject,
  canUpdateProject,
  canViewProject,
  canDeleteProject,
} = require('../utils/roles');
module.exports = (app) => {
  const pay = require('../controllers/pay.controller');
  var router = require('express').Router();

  // Retrieve all pay
  router.get(
    '/',
    (req, res, next) => {
      if (!canViewProject(req.functions['1'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    pay.findAll,
    pay.findCenter
  );

  // Retrieve a single pay with id
  router.get(
    '/edit/:id',
    (req, res, next) => {
      if (!canUpdateProject(req.functions['1'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    pay.edit
  );
  router.get('/content/:id', pay.content);
  // Update a pay with id
  router.put('/:id', pay.update);
  router.patch('/qualified/:id', pay.updateQualified);
  router.patch('/substandard/:id', pay.updateSubstandard);

  app.use('/pay', authMiddleware.loggedin, router);
  app.get('/500', (req, res) => {
    res.render('err');
  });
  app.get('/404', (req, res) => {
    res.render('404');
  });
};
