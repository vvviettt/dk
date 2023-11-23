const authMiddleware = require('../middlewares/auth.middleware');
const {
  canCreateProject,
  canUpdateProject,
  canViewProject,
  canDeleteProject,
} = require('../utils/roles');
module.exports = (app) => {
  const role = require('../controllers/role.controller');
  var router = require('express').Router();

  // Retrieve all role
  router.post('/', role.store);
  router.get('/', role.findAll, (req, res) => {
    console.log('req.user: ', req.user);
    // res.json(scopedProjects(req.user, 3));
  });
  router.get('/staff/:id', role.edit);
  router.put('/:id', role.update);

  app.use('/role', authMiddleware.loggedin, authMiddleware.authScopedProjects, router);
  app.get('/500', (req, res) => {
    res.render('err');
  });
  app.get('/404', (req, res) => {
    res.render('404');
  });
};
