const sql = require('./db');

const Fee = function (fee) {
  this.id = fee.id;
  this.from = fee.from;
  this.to = fee.to;
  this.fee = fee.fee;
};

Fee.create = (newFee, result) => {
  sql.query('INSERT INTO fee_setting (`from`, `to`, `fee`) VALUES ?', [newFee], (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    // console.log('created Fee: ', { id: res.insertId, ...newFee });

    result(null, { id: res.insertId, ...newFee });
  });
};

Fee.getAll = (name, result) => {
  let query = 'SELECT * FROM fee_setting';
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
Fee.updateById = (id, fee, result) => {
  // console.log(infringe, id);
  sql.query(
    `UPDATE fee_setting SET from = ?, to = ?, fee = ? WHERE id = ?`,
    [fee.from, fee.to, fee.fee, id],
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

      result(null, { id: id, ...fee });
    }
  );
};

Fee.remove = (id, result) => {
  sql.query('DELETE FROM fee_setting WHERE id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found infringe with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    // console.log('deleted infringe with id: ', id);
    result(null, res);
  });
};
Fee.removeAll = (result) => {
  sql.query('DELETE FROM fee_setting', (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};
module.exports = Fee;
