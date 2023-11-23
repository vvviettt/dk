const sql = require('./db');

const Infringe = function (infringe) {
  this.id = infringe.id;
  this.infringe_date = infringe.infringe_date;
  this.license_plate = infringe.license_plate;
  this.violator_name = infringe.violator_name;
  this.infringes_name = infringe.infringes_name;
  this.handling_agency = infringe.handling_agency;
  this.status = infringe.status;
};

Infringe.create = (newInfringe, result) => {
  sql.query('INSERT INTO infringes SET ?', newInfringe, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newInfringe });
  });
};
Infringe.findById = (id, result) => {
  sql.query(`SELECT * FROM infringes WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    if (res.length) {
      // console.log("found infringe: ", res[0]);
      result(null, res[0]);
      return;
    }
    // not found infringe with the id
    result({ kind: 'not_found' }, null);
  });
};
Infringe.getAll = (result) => {
  let query = 'SELECT * FROM infringes ORDER BY infringe_date DESC';
  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    // console.log("infringe: ", res);
    result(null, res);
  });
};

Infringe.updateById = (id, infringe, result) => {
  // console.log(infringe, id);
  sql.query(
    `UPDATE infringes SET infringe_date = ?, license_plate = ?, violator_name = ?,infringes_name = ?, handling_agency = ?,status = ? WHERE id = ?`,
    [
      infringe.infringe_date,
      infringe.license_plate,
      infringe.violator_name,
      infringe.infringes_name,
      infringe.handling_agency,
      infringe.status,
      id,
    ],
    (err, res) => {
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

      // console.log("updated infringe: ", { id: id, ...infringe });
      result(null, { id: id, ...infringe });
    }
  );
};
Infringe.remove = (id, result) => {
  sql.query('DELETE FROM infringes WHERE id = ?', id, (err, res) => {
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
  });
};
Infringe.removeAll = (result) => {
  sql.query('DELETE FROM infringes', (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};
module.exports = Infringe;
