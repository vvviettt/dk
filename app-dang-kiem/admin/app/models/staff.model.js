const sql = require('./db');

const Staff = function (staff) {
  this.id = staff.id;
  this.role_id = staff.role_id;
  this.name = staff.name;
  this.username = staff.username;
  this.phone = staff.phone;
  this.password = staff.password;
  this.adress = staff.adress;
  this.email = staff.email;
  this.status = staff.status;
  this.user_id_sso = staff.user_id_sso;
  this.concurrency_stamp = staff.concurrency_stamp;
};

Staff.create = (newStaff, result) => {
  let queryUserFunction =
    'INSERT INTO user_function (`function_id`, `user_id`, `create1`, `update1`, `delete1`, `read1`) VALUES ?';
  sql.query(
    'INSERT INTO users (`name`, `role_id`, `email`, `username`, `phone`, `adress`, `status`, `password`, `user_id_sso`, `concurrency_stamp`) VALUES (?)',
    [newStaff],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }
      let data = [];
      for (let i = 1; i <= 10; i++) {
        data.push([i, res.insertId, 0, 0, 0, 1]);
      }
      sql.query(queryUserFunction, [data], (err, res) => {
        if (err) {
          console.log('error: ', err);
          result(null, err);
          return;
        }
        result(null, { id: res.insertId, ...newStaff });
      });
    }
  );
};
Staff.findByEmail = (email, phone, username, result) => {
  sql.query(
    `SELECT * from users WHERE email = '${email}' OR phone = '${phone}' OR username = '${username}'`,
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
Staff.findById = (id, result) => {
  sql.query(`SELECT * from users WHERE id = '${id}'`, (err, res) => {
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
Staff.getAll = (name, result) => {
  let query = `SELECT id, name, email, phone, username,  status, user_id_sso FROM users WHERE role_id = 3 and delete_at is null ORDER BY id DESC`;
  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
  }
  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Staff.updateByIdWithPassword = (id, staff, result) => {
  sql.query(
    `UPDATE users SET name=?, email=?, phone=?, password=?, adress=?, status=?, username=?, concurrency_stamp=? WHERE id = ?`,
    [
      staff.name,
      staff.email,
      staff.phone,
      staff.password,
      staff.adress,
      staff.status,
      staff.username,
      staff.concurrency_stamp,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }
      result(null, { id: id, ...staff });
    }
  );
};
Staff.updateByIdWithNotPassword = (id, staff, result) => {
  sql.query(
    `UPDATE users SET name=?, email=?, phone=?, adress=?, username=?, status=?, concurrency_stamp=? WHERE id = ?`,
    [
      staff.name,
      staff.email,
      staff.phone,
      staff.adress,
      staff.username,
      staff.status,
      staff.concurrency_stamp,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found staff with the id
        result({ kind: 'not_found' }, null);
        return;
      }
      result(null, { id: id, ...staff });
    }
  );
};
Staff.remove = (user_id_sso, result) => {
  sql.query(
    'UPDATE users set delete_at = CURRENT_TIMESTAMP  where user_id_sso = ?',
    user_id_sso,
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: 'not_found' }, null);
        return;
      }
      result(null, res);
    }
  );
};
module.exports = Staff;
