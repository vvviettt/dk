const User = require('../../models/user.model');
const Staff = require('../../models/staff.model');

require('dotenv/config');
const bcrypt = require('bcrypt');
const SSO = require('../../config/tokenSSO');
const apiSSO = require('../../utils/apiSSO');

exports.showLoginForm = (req, res) => {
  res.render('auth/login', { layout: '../views/auth/layoutAuth.ejs', title: 'Đăng nhập' });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const conflictError = 'Tên đăng nhập / Mật khẩu không đúng!!!';

  if (username && password) {
    User.findByUsername(username, async (err, user) => {
console.log(user);
      if (!user) {
        const token = await SSO.getToken();
        const listUser = await apiSSO.getAllData(token.access_token);
        const itemsUser = listUser.items.find((x) => x.userName === `${username}`);
        const login_result = await apiSSO.loginUser(username, password);
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND));
        if (listUser.items.findIndex((x) => x.userName === `${username}`) !== -1) {
          if (login_result.result == 1) {
            // check lại chỗ này
            const staff = [
              itemsUser.userName,
              3,
              itemsUser.email,
              itemsUser.userName,
              itemsUser.phoneNumber ? itemsUser.phoneNumber : '',
              'Đà Nẵng',
              1,
              hashedPassword,
              itemsUser.id,
              itemsUser.concurrencyStamp,
            ];
            Staff.create(staff, (err, data) => {
              if (!err) {
                // console.log('AAAAAAAAA', req.session);

                req.session.loggedin = true;
                req.session.user = user;
                res.redirect('/management');
              }
            });
          } else {
            res.render('auth/login', {
              username,
              password,
              conflictError,
              layout: '../views/auth/layoutAuth.ejs',
              title: 'Đăng nhập',
            });
          }
        } else {
          res.render('auth/login', {
            username,
            password,
            conflictError,
            layout: '../views/auth/layoutAuth.ejs',
            title: 'Đăng nhập',
          });
        }
      } else {
        bcrypt.compare(password, user.password, (err, result) => {
console.log('ERR',result);
console.log(password);
          if (result == true) {
            req.session.loggedin = true;
            req.session.user = user;
            res.redirect('/management');
          } else {
            res.render('auth/login', {
              username,
              password,
              conflictError,
              layout: '../views/auth/layoutAuth.ejs',
              title: 'Đăng nhập',
            });
          }
        });
      }
    });
  } else {
    res.render('auth/login', {
      username,
      password,
      conflictError,
      layout: '../views/auth/layoutAuth.ejs',
      title: 'Đăng nhập',
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) res.redirect('/500');
    res.redirect('/login');
  });
};
