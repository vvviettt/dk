const Profile = require('../models/profile.model');
const Money = require('../utils/convert');

// Show form create profile
exports.create = (req, res) => {
  res.locals.status = req.query.status;
  Profile.getCategories(null, (err, data) => {
    if (err) res.redirect('/500');
    else
      res.render('profile/create', {
        profile: data,
        title: 'Thêm mới',
        Username: req.user.username,
      });
  });
};
// Create and Save a new profile
exports.store = (req, res) => {
  // Validate request
  if (!req.body) {
    res.redirect('/profile/create?status=error');
  }

  // Create a profile
  let data1 = [];
  if (typeof req.body.name === 'string') {
    data1.push([req.body.name, req.body.status]);
  } else {
    for (let i = 0; i < req.body.name.length; i++) {
      data1.push([req.body.name[i], req.body.status[i]]);
    }
  }

  // Save profile in the database
  Profile.updateById(req.body.hot_line, (err, data) => {
    Profile.removeAll((err, data) => {
      Profile.create(data1, (err, data) => {
        if (err) res.redirect('/profile/create?status=error');
        else res.redirect('/profile');
      });
    });
  });
};
// Retrieve all profile from the database (with condition).
exports.findAll = (req, res) => {
  res.locals.deleted = req.query.deleted;
  Profile.getAll((err, data) => {
    Profile.getHotLine((err, phone) => {
      if (err) res.redirect('/500');
      else
        res.render('profile/index', {
          hot_line: phone,
          profile: data,
          title: 'Thông tin hồ sơ',
          Username: req.user.username,
        });
    });
  });
};
exports.update = (req, res) => {
  Profile.updateById(req.params.id, new profile(), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/profile');
  });
};
exports.delete = (req, res) => {
  Profile.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/profile');
  });
};

exports.deleteAll = (req, res) => {
  Profile.removeAll((err, data) => {
    if (err) res.redirect('/500');
    else res.redirect('/profile?deleted=true');
  });
};
