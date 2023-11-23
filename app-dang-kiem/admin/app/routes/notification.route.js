const authMiddleware = require('../middlewares/auth.middleware');
const {
  canCreateProject,
  canUpdateProject,
  canViewProject,
  canDeleteProject,
} = require('../utils/roles');
module.exports = (app) => {
  const notification = require('../controllers/notification.controller');
  var router = require('express').Router();

  // Show form create notification
  router.get(
    '/',
    (req, res, next) => {
      if (!canViewProject(req.functions['8'])) {
        res.status(401);
        return res.send(
          `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
        );
      }

      next();
    },
    notification.edit
  );
  // Store notification
  router.put('/', notification.update);

  app.use('/notification', authMiddleware.loggedin, router);
  app.get('/500', (req, res) => {
    res.render('err');
  });
  app.get('/404', (req, res) => {
    res.render('404');
  });
};
