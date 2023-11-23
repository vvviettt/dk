const authMiddleware = require('../middlewares/auth.middleware');
const {
  canCreateProject,
  canUpdateProject,
  canViewProject,
  canDeleteProject,
} = require('../utils/roles');

module.exports = (app) => {
  const fee = require('../controllers/fee.controller');
  var router = require('express').Router();

  // Retrieve all fee
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
    fee.findAll
  );

  // Show form create fee
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
    fee.create
  );
  // Store fee
  router.post('/', fee.store);
  router.put('/:id', fee.update);
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
    fee.delete
  );
  router.delete('/delete', fee.deleteAll);

  app.use('/fee', authMiddleware.loggedin, router);
  app.get('/500', (req, res) => {
    res.render('err');
  });
  app.get('/404', (req, res) => {
    res.render('404');
  });
};
