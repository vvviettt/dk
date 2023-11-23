const sql = require('./db');

const Checked = function (checked) {
  this.id = checked.id;
  this.owner_name = checked.owner_name;
  this.owner_phone = checked.owner_phone;
  this.date = checked.date;
  this.status = checked.status;
  this.plan_date = checked.plan_date;
  this.payment_date = checked.payment_date;
  this.license_plate = checked.license_plate;
  this.address = checked.address;
  this.staff_id = checked.staff_id;
  this.staff_name = checked.staff_name;
  this.car_delivery_time = checked.car_delivery_time;
};

Checked.findById = (id, result) => {
  sql.query(
    `SELECT registry_managements.id, registry_managements.license_plate, registry_managements.staff_id, registry_managements.staff_name, registry_managements.car_delivery_time,registry_managements.status, registry_managements.date, registry_managements.payment_date,registry_managements.plan_date,registry_managements.address, registry_managements.owner_name,registry_managements.owner_phone,  vehicle_types.name as types_name 
  FROM registry_managements
  INNER JOIN vehicle_types ON registry_managements.vehicle_type_id = vehicle_types.id AND registry_managements.id = ${id}`,
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }
      if (res.length) {
        // console.log("found checked: ", res[0]);
        result(null, res[0]);
        return;
      }
      // not found checked with the id
      result({ kind: 'not_found' }, null);
    }
  );
};
Checked.getAll = (start, end, result) => {
  let filterDate = '';
  if (start !== '' && end !== '') {
    filterDate = ` AND date BETWEEN '${start}'AND '${end}' `;
  }
  let query = `SELECT * FROM registry_managements WHERE completed_at is not null ${filterDate} ORDER BY date`;
  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    // console.log("checked: ", res);
    result(null, res);
  });
};

Checked.updateById = (id, checked, result) => {
  // console.log(checked, id);
  sql.query(
    `UPDATE registry_managements SET plan_date = ?, payment_date = ?, status = ? WHERE id = ?`,
    [checked.plan_date, checked.payment_date, checked.status, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found checked with the id
        result({ kind: 'not_found' }, null);
        return;
      }

      // console.log("updated checked: ", { id: id, ...checked });
      result(null, { id: id, ...checked });
    }
  );
};

Checked.remove = (id, result) => {
  sql.query('DELETE FROM  bills  WHERE registry_id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found checked with the id
      result({ kind: 'not_found' }, null);
      return;
    }

    sql.query('DELETE FROM  registry_managements  WHERE id = ?', id, (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      result(null, res);
    });
  });
};

module.exports = Checked;
