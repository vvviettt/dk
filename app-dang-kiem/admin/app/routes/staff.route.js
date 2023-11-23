const authMiddleware = require('../middlewares/auth.middleware');
const {
  canCreateProject,
  canUpdateProject,
  canViewProject,
  canDeleteProject,
} = require('../utils/roles');
module.exports = (app) => {
  const staff = require('../controllers/staff.controller');
  var router = require('express').Router();

  // Retrieve all staff
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
    staff.findAll
  );

  // Show form create staff
  router.get(
    '/create',
    (req, res, next) => {
      if (!canCreateProject(req.functions['7'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    staff.create
  );
  // Store staff
  router.post('/', staff.store);

  // Retrieve a single staff with id
  router.get(
    '/edit/:id',
    (req, res, next) => {
      if (!canUpdateProject(req.functions['7'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    staff.edit
  );
  // Update a staff with id
  router.put('/:id', staff.update);

  // Delete a staff with id
  router.get(
    '/delete/:id',
    (req, res, next) => {
      if (!canDeleteProject(req.functions['7'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    staff.delete
  );

  app.use('/staff', authMiddleware.loggedin, router);
  app.get('/500', (req, res) => {
    res.render('err');
  });
  app.get('/404', (req, res) => {
    res.render('404');
  });
};
