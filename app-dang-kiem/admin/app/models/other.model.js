const sql = require('./db');

const Other_configuration = function (other) {
  this.allowed_days = other.allowed_days;
  this.number_vehicles = other.number_vehicles;
  this.id = other.id;
};

Other_configuration.findById = (result) => {
  sql.query(`SELECT * FROM other_configuration WHERE id = 1`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    if (res.length) {
      //   console.log("found other: ", res[0]);
      result(null, res[0]);
      return;
    }
    // not found other with the id
    result({ kind: 'not_found' }, null);
  });
};
Other_configuration.updateById = (other, result) => {
  sql.query(
    `UPDATE other_configuration SET allowed_days=?, number_vehicles=? WHERE id = 1`,
    [other.allowed_days, other.number_vehicles],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found other with the id
        result({ kind: 'not_found' }, null);
        return;
      }
      result(null, other);
    }
  );
};

module.exports = Other_configuration;
