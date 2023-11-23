const authMiddleware = require('../middlewares/auth.middleware');
const {
  canCreateProject,
  canUpdateProject,
  canViewProject,
  canDeleteProject,
} = require('../utils/roles');

module.exports = (app) => {
  const profile = require('../controllers/profile.controller');
  var router = require('express').Router();

  // Retrieve all profile
  router.get(
    '/',
    (req, res, next) => {
      if (!canViewProject(req.functions['9'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    profile.findAll
  );

  // Show form create profile
  router.get(
    '/create',
    (req, res, next) => {
      if (!canCreateProject(req.functions['9'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    profile.create
  );
  // Store profile
  router.post('/', profile.store);
  router.put('/:id', profile.update);
  router.get(
    '/delete/:id',
    (req, res, next) => {
      if (!canDeleteProject(req.functions['9'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    profile.delete
  );
  router.delete('/delete', profile.deleteAll);

  app.use('/profile', authMiddleware.loggedin, router);
  app.get('/500', (req, res) => {
    res.render('err');
  });
  app.get('/404', (req, res) => {
    res.render('404');
  });
};
