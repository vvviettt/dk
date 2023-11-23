const { canViewProject, canDeleteProject, scopedProjects } = require('../utils/roles');
const User = require('../models/user.model');
const SSO = require('../config/tokenSSO');
require('dotenv/config');

exports.loggedin = async (req, res, next) => {
  if (req.session.loggedin) {
    req.user = req.session.user;
    const functions = await User.getUserFunction(req.user.username);
    // const token = await SSO.getToken();
    req.functions = { ...functions };
    // req.SSO_token = token.access_token;
    // console.log('token: ', req.SSO_token);
    next();
  } else {
    res.redirect('/login');
  }
};

exports.isAuth = (req, res, next) => {
  if (req.session.loggedin) {
    res.locals.user = req.session.user;
    res.redirect('/management');
  } else {
    next();
  }
};

exports.setProject = (req, res, next) => {
  const projectId = parseInt(req.params.projectId);
  req.project = projects.find((project) => project.id === projectId);

  if (req.project == null) {
    res.status(404);
    return res.send('Project not found');
  }
  next();
};

exports.authGetProject = (req, res, next) => {
  if (!canViewProject(req.session.user.role_id, req.project)) {
    res.status(401);
    return res.send(
      `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
    );
  }

  next();
};
exports.authScopedProjects = (req, res, next) => {
  if (!scopedProjects(req.session.user)) {
    res.status(401);
    return res.send(
      `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
    );
  }

  next();
};

exports.authDeleteProject = (req, res, next) => {
  if (!canDeleteProject(req.functions['1'].delete1)) {
    res.status(401);
    return res.send(
      `<h1 style="color: #d01818;display: flex;justify-content: center;padding: 50px;">Không được phép truy cập !!!</h1>`
    );
  }

  next();
};
