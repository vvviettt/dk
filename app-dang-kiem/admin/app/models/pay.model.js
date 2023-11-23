const sql = require('./db');

const Pay = function (pay) {
  this.id = pay.id;
  this.name = pay.name;
  this.date = pay.date;
  this.status = pay.status;
  this.license_plate = pay.license_plate;
  this.plan_date = pay.plan_date;
  this.payment_date = pay.payment_date;
  this.address = pay.address;
  this.staff_id = pay.staff_id;
  this.staff_name = pay.staff_name;
  this.car_delivery_time = pay.car_delivery_time;
  // this.completed_at = pay.completed_at;
};

Pay.create = (newPay, result) => {
  sql.query('INSERT INTO registry_managements SET ?', newPay, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    // console.log("created registry_managements: ", { id: res.insertId, ...newPay });
    result(null, { id: res.insertId, ...newPay });
  });
};
Pay.findById = (id, result) => {
  sql.query(
    `SELECT registry_managements.id, registry_managements.license_plate, registry_managements.staff_id, registry_managements.staff_name, registry_managements.car_delivery_time, registry_managements.date, registry_managements.address, registry_managements.owner_name,registry_managements.owner_phone,  vehicle_types.name as types_name 
  FROM registry_managements
  INNER JOIN vehicle_types ON registry_managements.vehicle_type_id =  vehicle_types.id AND registry_managements.id = ${id}`,
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }
      if (res.length) {
        // console.log('found pay: ', res[0]);
        result(null, res[0]);
        return;
      }
      // not found pay with the id
      result({ kind: 'not_found' }, null);
    }
  );
};
Pay.getAll = (center, start, end, result) => {
  let filterDate = '';
  let testingName = '';

  if (start !== '' && end !== '') {
    filterDate = ` AND registry_managements.date BETWEEN '${start}' AND '${end}' `;
  }
  if (center !== '' && center !== undefined) {
    testingName = ` AND testing_centers.name = '${center}' `;
  }
  let query = `SELECT registry_managements.id, registry_managements.license_plate, registry_managements.date, 
  registry_managements.address, registry_managements.owner_name,registry_managements.owner_phone, testing_centers.name as testing_name 
      FROM registry_managements
      INNER JOIN testing_centers 
      ON registry_managements.testing_center_id = testing_centers.id 
      WHERE registry_managements.status = 0  
      AND registry_managements.pay_at is not null ${filterDate} ${testingName} ORDER BY date`;
  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    // console.log("pay: ", res);
    result(null, res);
  });
};
Pay.getCenter = (result) => {
  let query = 'SELECT name FROM testing_centers';
  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};
Pay.updateById = (id, pay, result) => {
  // console.log(pay, id);
  sql.query(
    `UPDATE registry_managements SET name = ?, tariff = ?, license_fee = ? WHERE id = ?`,
    [pay.name, pay.tariff, pay.license_fee, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found pay with the id
        result({ kind: 'not_found' }, null);
        return;
      }

      // console.log("updated pay: ", { id: id, ...pay });
      result(null, { id: id, ...pay });
    }
  );
};
Pay.updateStatus = (id, pay, result) => {
  sql.query(
    'UPDATE registry_managements SET status = ?, completed_at = current_timestamp WHERE id = ?',
    [pay.status, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found pay with the id
        result({ kind: 'not_found' }, null);
        return;
      }
      // console.log("update payed: ", pay.status);
      result(null, res);
    }
  );
};

Pay.updateStatusQualified = (id, pay, result) => {
  sql.query(
    `UPDATE registry_managements SET status = ?, plan_date = ?, payment_date = ?, completed_at = current_timestamp WHERE id = ?`,
    [pay.status, pay.plan_date, pay.payment_date, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found pay with the id
        result({ kind: 'not_found' }, null);
        return;
      }
      // console.log("update StatusQualified: ", pay);
      result(null, res);
    }
  );
};

Pay.remove = (id, result) => {
  sql.query('DELETE FROM registry_managements WHERE id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found pay with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    // console.log("deleted pay with id: ", id);
    result(null, res);
  });
};
module.exports = Pay;
