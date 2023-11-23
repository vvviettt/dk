const authMiddleware = require('../middlewares/auth.middleware');
const {
  canCreateProject,
  canUpdateProject,
  canViewProject,
  canDeleteProject,
} = require('../utils/roles');

module.exports = (app) => {
  const management = require('../controllers/management.controller');
  var router = require('express').Router();

  // Retrieve all management
  router.get(
    '/',
    (req, res, next) => {
      if (!canViewProject(req.functions['0'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    management.findAll
  );

  // Show form create management
  router.get(
    '/create',
    (req, res, next) => {
      if (!canCreateProject(req.functions['0'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    management.create
  );
  // Store management
  router.post('/', management.store);
  router.post('/check', management.errorLicensePlate);

  // Retrieve a single management with id
  router.get(
    '/edit/:id',
    (req, res, next) => {
      if (!canUpdateProject(req.functions['0'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    management.edit
  );
  router.get('/content/:id', management.content);

  // Update a management with id
  router.put('/:id', management.update);
  router.patch('/payed/:id', management.payed);

  router.patch('/assignment/:id', management.assignment);

  // Delete a management with id
  router.get(
    '/delete/:id',
    (req, res, next) => {
      if (!canDeleteProject(req.functions['0'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    management.delete
  );

  app.use('/management', authMiddleware.loggedin, router);
  app.get('/500', (req, res) => {
    res.render('err');
  });
  app.get('/404', (req, res) => {
    res.render('404');
  });
};
