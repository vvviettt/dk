const sql = require('./db');

const User = function (user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
  this.username = user.username;
};

User.create = (newUser, result) => {
  sql.query('INSERT INTO users SET ?', newUser, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    // console.log("created user: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

User.findByEmail = (email, result) => {
  sql.query(`SELECT * from users WHERE email = '${email}'  `, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    result(null, null);
  });
};

User.getUserIdSSOByEmail = (email) => {
  return new Promise((resolve, reject) => {
    try {
      console.log('DHHHHHH');
      sql.query(`SELECT * from users WHERE email = '${email}' `, (err, value) => {
        if (err) {
          return reject(err);
        }
        resolve(value[0]);
      });
    } catch (error) {
      reject(error);
    }
  });
};
User.findByUsername = (username, result) => {
  sql.query(
    `SELECT id, username, phone, role_id, password from users WHERE username = '${username}' and (role_id = 2 OR role_id = 3) and delete_at is null`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      result(null, null);
    }
  );
};

User.resetPassword = (email, password, result) => {
  sql.query('UPDATE users SET password = ? WHERE email = ?', [password, email], (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }
    // console.log('updated user: ', { email: email, password: password });

    result(null, { email: email });
  });
};

User.getUserFunction = (username) => {
  return new Promise((resolve, reject) => {
    try {
      sql.query(
        `SELECT username, user_id, function_id, create1, update1, delete1, read1
      from registration.user_function 
      INNER JOIN registration.users 
      ON user_function.user_id = users.id 
      WHERE username = '${username}'`,
        (err, value) => {
          if (err) {
            return reject(err);
          }
          resolve(value);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = User;
