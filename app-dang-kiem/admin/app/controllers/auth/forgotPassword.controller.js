const User = require('../../models/user.model');
const bcrypt = require('bcrypt');
const mailer = require('../../utils/mailer');
const apiSSO = require('../../utils/apiSSO');
const SSO = require('../../config/tokenSSO');
exports.showForgotForm = (req, res) => {
  res.render('auth/passwords/email', {
    layout: '../views/auth/layoutAuth.ejs',
    title: 'Quên mật khẩu',
  });
};

exports.sendResetLinkEmail = (req, res) => {
  if (!req.body.email) {
    res.redirect('/password/reset');
  } else {
    User.findByEmail(req.body.email, (err, user) => {
      if (!user) {
        res.redirect('/password/reset');
      } else {
        bcrypt.hash(user.email, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashedEmail) => {
          mailer.sendMail(
            user.email,
            'Reset password SMARTEST',
            `<p> Để đặt lại mật khẩu trên <strong>Hệ thống quản lý đăng kiểm SMARTEST,  </strong>vui lòng truy cập đường dẫn dưới đây: </p>
            <a href="${process.env.APP_URL}/password/reset/${user.email}?token=${hashedEmail}"> Reset Password </a>`
          );
        });
        res.redirect('/login');
      }
    });
  }
};

exports.showResetForm = (req, res) => {
  if (!req.params.email || !req.query.token) {
    res.redirect('/password/reset');
  } else {
    res.render('auth/passwords/reset', {
      email: req.params.email,
      token: req.query.token,
      layout: '../views/auth/layoutAuth.ejs',
      title: 'Khôi phục mật khẩu',
    });
  }
};

exports.reset = async (req, res) => {
  const { email, token, password } = req.body;

  console.log('email', req.body);
  if (!email || !token || !password) {
    res.redirect('/password/reset');
  } else {
    const token_SSO = await SSO.getToken();
    const itemUser = await User.getUserIdSSOByEmail(email);
    const detailUser = await apiSSO.accountDetail(token_SSO.access_token, itemUser.user_id_sso);
    await apiSSO.updateWithPasswordUser(
      token_SSO.access_token,
      itemUser.user_id_sso,
      detailUser.userName,
      detailUser.phoneNumber,
      email,
      password,
      detailUser.concurrencyStamp
    );
    bcrypt.compare(email, token, (err, result) => {
      if (result == true) {
        bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND)).then((hashedPassword) => {
          User.resetPassword(email, hashedPassword, (err, result) => {
            if (!err) {
              res.redirect('/login');
            } else {
              res.redirect('/500');
            }
          });
        });
      } else {
        res.redirect('/password/reset');
      }
    });
  }
};
