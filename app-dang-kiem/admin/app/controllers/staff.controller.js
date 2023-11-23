const Staff = require('../models/staff.model');
const bcrypt = require('bcrypt');
require('dotenv/config');
const apiSSO = require('../utils/apiSSO');
const SSO = require('../config/tokenSSO');

// Show form create staff
exports.create = (req, res) => {
  res.locals.status = req.query.status;
  res.render('staff/create', { title: 'Thêm mới', Username: req.user.username });
};
// Create and Save a new staff
exports.store = async (req, res) => {
  const { email, phone, username, password, confirm_password, name } = req.body;
  const token = await SSO.getToken();
  if (confirm_password !== password) {
    const conflictError = 'Xác nhận lại mật khẩu';
    res.render('staff/create', {
      email,
      phone,
      password,
      name,
      username,
      conflictError,
      title: 'Thêm mới',
      Username: req.user.username,
    });
  } else {
    if (email && phone && password && name && username) {
      const conflictError = 'Có thể Email / Số điện thoại / Tên đăng nhập đã tồn tại';

      Staff.findByEmail(email, phone, username, (err, staff) => {
        if (err || staff) {
          res.render('staff/create', {
            email,
            phone,
            password,
            name,
            username,
            conflictError,
            title: 'Thêm mới',
            Username: req.user.username,
          });
        }
      });
      //Tạo tài khoản đồng thời ở phía thứ 3
      await apiSSO.postUserData(token.access_token, username, password, phone, email);
      const listUser = await apiSSO.getAllData(token.access_token);
      const user_id_sso = await listUser.items.find((x) => x.userName === `${username}`);
      // console.log('user_id_sso: ', user_id_sso);
      bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashed) => {
        const staff = [
          req.body.name,
          3,
          req.body.email,
          req.body.username,
          req.body.phone,
          req.body.adress,
          !req.body.status ? false : true,
          hashed,
          user_id_sso.id,
          user_id_sso.concurrencyStamp,
        ];
        Staff.create(staff, (err, data) => {
          if (!err) {
            res.redirect('/staff');
          }
        });
      });
    } else {
      const conflictError = 'Thông tin xác thực của nhân viên đã tồn tại';
      res.render('staff/create', {
        email,
        phone,
        password,
        name,
        username,
        conflictError,
        title: 'Thêm mới',
        Username: req.user.username,
      });
    }
  }
};
exports.findAll = (req, res) => {
  res.locals.deleted = req.query.deleted;
  const title = req.query.title;

  Staff.getAll(title, (err, data) => {
    if (err) res.redirect('/500');
    else
      res.render('staff/index', {
        staff: data,
        title: 'Quản lý nhân viên',
        Username: req.user.username,
      });
  });
};

// Find a single staff with a id
exports.edit = (req, res) => {
  res.locals.status = req.query.status;

  Staff.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else
      res.render('staff/edit', { staff: data, title: 'Chỉnh sửa', Username: req.user.username });
  });
};
// Update a staff identified by the id in the request
exports.update = async (req, res) => {
  // Nơi để API SSO khi update user (phải có user_id, concurrencyStamp)

  // Validate Request
  const { password, confirm_password, username, user_id_sso, phone, email } = req.body;
  if (password != '') {
    if (password && confirm_password !== password) {
      const conflictError = 'Xác nhận lại mật khẩu';
      Staff.findById(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === 'not_found') {
            res.redirect('/404');
          } else {
            res.redirect('/500');
          }
        } else
          res.render('staff/edit', {
            staff: data,
            conflictError,
            title: 'Chỉnh sửa',
            Username: req.user.username,
          });
      });
    } else {
      const token = await SSO.getToken();
      const itemsUser = await apiSSO.accountDetail(token.access_token, user_id_sso);
      await apiSSO.updateWithPasswordUser(
        token.access_token,
        user_id_sso,
        username,
        phone,
        email,
        password,
        itemsUser.concurrencyStamp
      );

      bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashed) => {
        // Create a staff
        const staff = new Staff({
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          phone: req.body.phone,
          adress: req.body.adress,
          status: req.body.status,
          password: hashed,
          concurrency_stamp: itemsUser.concurrencyStamp,
        });

        Staff.updateByIdWithPassword(req.params.id, staff, (err, data) => {
          if (err) {
            if (err.kind === 'not_found') {
              res.redirect('/404');
            } else {
              res.redirect('/500');
            }
          } else res.redirect('/staff');
        });
      });
    }
  } else {
    const token = await SSO.getToken();
    const itemsUser = await apiSSO.accountDetail(token.access_token, user_id_sso);
    await apiSSO.updateNoPasswordUser(
      token.access_token,
      user_id_sso,
      username,
      phone,
      email,
      itemsUser.concurrencyStamp
    );
    const staff = new Staff({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      phone: req.body.phone,
      adress: req.body.adress,
      status: req.body.status,
      concurrency_stamp: itemsUser.concurrencyStamp,
    });

    Staff.updateByIdWithNotPassword(req.params.id, staff, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.redirect('/404');
        } else {
          res.redirect('/500');
        }
      } else res.redirect('/staff');
    });
  }
};
// Delete a staff with the specified id in the request
exports.delete = async (req, res) => {
  const token = await SSO.getToken();
  await apiSSO.deleteUser(token.access_token, req.params.id);
  Staff.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.redirect('/404');
      } else {
        res.redirect('/500');
      }
    } else res.redirect('/staff');
  });
};
