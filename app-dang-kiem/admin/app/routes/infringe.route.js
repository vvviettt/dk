const authMiddleware = require('../middlewares/auth.middleware');
const {
  canCreateProject,
  canUpdateProject,
  canViewProject,
  canDeleteProject,
} = require('../utils/roles');

module.exports = (app) => {
  const infringe = require('../controllers/infringe.controller');
  var router = require('express').Router();

  // Retrieve all infringe
  router.get(
    '/',
    (req, res, next) => {
      if (!canViewProject(req.functions['5'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    infringe.findAll
  );

  // Show form create infringe
  router.get(
    '/create',
    (req, res, next) => {
      if (!canCreateProject(req.functions['5'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    infringe.create
  );
  // Store infringe
  router.post('/', infringe.store);

  // Retrieve a single infringe with id
  router.get(
    '/edit/:id',
    (req, res, next) => {
      if (!canUpdateProject(req.functions['5'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    infringe.edit
  );
  // Update a infringe with id
  router.put('/:id', infringe.update);

  // Delete a infringe with id
  router.get(
    '/delete/:id',
    (req, res, next) => {
      if (!canDeleteProject(req.functions['5'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    infringe.delete
  );

  // Delete all infringe
  router.delete('/delete', infringe.deleteAll);

  app.use('/infringe', authMiddleware.loggedin, router);
  app.get('/500', (req, res) => {
    res.render('err');
  });
  app.get('/404', (req, res) => {
    res.render('404');
  });
};
