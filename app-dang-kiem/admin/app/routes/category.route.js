const authMiddleware = require('../middlewares/auth.middleware');
const {
  canCreateProject,
  canUpdateProject,
  canViewProject,
  canDeleteProject,
} = require('../utils/roles');
module.exports = (app) => {
  const category = require('../controllers/category.controller');
  var router = require('express').Router();

  // Retrieve all category
  router.get(
    '/',
    (req, res, next) => {
      if (!canViewProject(req.functions['4'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    category.findAll
  );

  // Show form create category
  router.get(
    '/create',
    (req, res, next) => {
      if (!canCreateProject(req.functions['4'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    category.create
  );
  // Store category
  router.post('/', category.store);
  router.post('/file', category.uploadFile);
  // Retrieve a single category with id
  router.get(
    '/edit/:id',
    (req, res, next) => {
      if (!canUpdateProject(req.functions['4'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    category.edit
  );
  // Update a category with id
  router.put('/:id', category.update);

  // Delete a category with id
  router.get(
    '/delete/:id',
    (req, res, next) => {
      if (!canDeleteProject(req.functions['4'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    category.delete
  );

  app.use('/category', authMiddleware.loggedin, router);
  app.get('/500', (req, res) => {
    res.render('err');
  });
  app.get('/404', (req, res) => {
    res.render('404');
  });
};
