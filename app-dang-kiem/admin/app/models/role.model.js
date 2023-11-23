const sql = require('./db');

const Role = function (role) {
  this.id = role.id;
  this.function_id = role.function_id;
  this.user_id = role.user_id;
  this.create = role.create;
  this.update = role.update;
  this.delete = role.delete;
  this.read = role.read;
};

Role.create = (newRole, result) => {
  sql.query(
    'INSERT INTO user_function (`function_id`, `user_id`, `create`, `update`, `delete`, `read`) VALUES ?',
    [newRole],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }
      // console.log('created users_function: ', { iddddd: res.insertId, ...newRole });
      result(null, { id: res.insertId, ...newRole });
    }
  );
};
Role.findByIdUser = (id, result) => {
  sql.query(`SELECT id, name, phone, username FROM users WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    if (res.length) {
      // console.log('found User: ', res[0]);
      result(null, res[0]);
      return;
    }
    // not found role with the id
    result({ kind: 'not_found' }, null);
  });
};
Role.findByIdUserFunction = (id, result) => {
  sql.query(
    `SELECT users.username, functions.name as name_function, user_function.function_id, user_function.id,  user_function.create1, user_function.update1, user_function.delete1, user_function.read1 
  FROM user_function
  INNER JOIN users ON users.id = user_function.user_id
  INNER JOIN functions ON functions.id = user_function.function_id WHERE user_function.user_id = ${id}`,
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }
      if (res.length) {
        // console.log('found UserFunction: ', res);
        result(null, res);
        return;
      }
      // not found role with the id
      result({ kind: 'not_found' }, null);
    }
  );
};
Role.getAll = (name, result) => {
  let query = `SELECT id, name, phone, username, role_id FROM users WHERE role_id = 3 AND delete_at is null ORDER BY id DESC`;
  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
  }
  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    // console.log("role: ", res);
    result(null, res);
  });
};

Role.updateById = (id, role, result) => {
  // console.log('content:', role);
  sql.query(
    // `UPDATE user_function SET function_id = ?, create = ?, update = ?, delete= ?, read = ?  WHERE user_id = ${id}`,
    'INSERT INTO user_function (id,function_id, user_id, create1, update1, delete1, read1) VALUES ? ON DUPLICATE KEY UPDATE id = VALUES(id), function_id = VALUES(function_id), user_id = VALUES(user_id),create1 = VALUES(create1),update1 = VALUES(update1),delete1 = VALUES(delete1),read1 = VALUES(read1)',
    [role],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found role with the id
        result({ kind: 'not_found' }, null);
        return;
      }

      // console.log('updated role: ', { id: id, ...role });
      result(null, { id: id, ...role });
    }
  );
};

module.exports = Role;
