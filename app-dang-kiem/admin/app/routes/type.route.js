const authMiddleware = require('../middlewares/auth.middleware');
const {
  canCreateProject,
  canUpdateProject,
  canViewProject,
  canDeleteProject,
} = require('../utils/roles');
module.exports = (app) => {
  const type = require('../controllers/type.controller');
  var router = require('express').Router();

  // Retrieve all type
  router.get(
    '/',
    (req, res, next) => {
      if (!canViewProject(req.functions['3'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    type.findAll
  );

  // Show form create type
  router.get(
    '/create',
    (req, res, next) => {
      if (!canCreateProject(req.functions['3'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    type.create
  );
  // Store type
  router.post('/', type.store);
  router.post('/file', type.uploadFile);

  // Retrieve a single type with id
  router.get(
    '/edit/:id',
    (req, res, next) => {
      if (!canUpdateProject(req.functions['3'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    type.edit
  );
  // Update a type with id
  router.put('/:id', type.update);

  // Delete a type with id
  router.get('/delete/:id', type.delete);

  // Delete all type
  router.delete(
    '/delete',
    (req, res, next) => {
      if (!canDeleteProject(req.functions['3'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    type.deleteAll
  );

  app.use('/type', authMiddleware.loggedin, router);
  app.get('/500', (req, res) => {
    res.render('err');
  });
  app.get('/404', (req, res) => {
    res.render('404');
  });
};
