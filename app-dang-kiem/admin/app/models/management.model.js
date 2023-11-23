const sql = require('./db');

const Management = function (management) {
  this.id = management.id;
  this.owner_name = management.owner_name;
  this.owner_phone = management.owner_phone;
  this.date = management.date;
  this.license_plate = management.license_plate;
  this.vehicle_type_id = management.vehicle_type_id;
  this.address = management.address;
  this.staff_id = management.staff_id;
  this.staff_name = management.staff_name;
  this.car_delivery_time = management.car_delivery_time;
  this.date_birth = management.date_birth;
  this.id_card = management.id_card;
  this.phone_number = management.phone_number;
};

Management.create = (newManagement, result) => {
  sql.query('INSERT INTO registry_managements SET ?', newManagement, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    // console.log("created registry_managements: ", { id: res.insertId, ...newManagement });
    result(null, { id: res.insertId, ...newManagement });
  });
};
Management.findById = (id, result) => {
  sql.query(
    `SELECT registry_managements.id, registry_managements.staff_id,registry_managements.license_plate, registry_managements.staff_id, registry_managements.staff_name, registry_managements.car_delivery_time, registry_managements.vehicle_type_id,registry_managements.date, registry_managements.address, registry_managements.owner_name,registry_managements.owner_phone,  vehicle_types.name as types_name 
  FROM registry_managements
  INNER JOIN vehicle_types ON registry_managements.vehicle_type_id = vehicle_types.id AND registry_managements.id = ${id}`,
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }
      if (res.length) {
        // console.log("found management: ", res[0]);
        result(null, res[0]);
        return;
      }
      // not found management with the id
      result({ kind: 'not_found' }, null);
    }
  );
};
Management.findByLicensePlate = (license_plate, result) => {
  sql.query(
    `SELECT * FROM registration.infringes where license_plate = '${license_plate}' AND status = 0`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res);
        return;
      }
      result(null, null);
    }
  );
};
Management.getAll = (start, end, result) => {
  let filterDate = '';
  if (start !== '' && end !== '') {
    filterDate = ` and date BETWEEN '${start}'AND '${end}' `;
  }
  // let query = `SELECT *, users.username FROM registry_managements
  // INNER JOIN users ON registry_managements.owner_id = users.id
  // WHERE registry_managements.pay_at is null AND registry_managements.status = 0 AND registry_managements.delete_at is null ${filterDate} ORDER BY date`;

  let query = `SELECT * FROM registry_managements WHERE pay_at is null AND status = 0 AND delete_at is null ${filterDate} ORDER BY date`;
  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    // console.log("management: ", res);
    result(null, res);
  });
};
//
Management.getTypes = (name, result) => {
  let query = 'SELECT * FROM vehicle_types';
  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
  }
  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    // console.log("category: ", res);
    result(null, res);
  });
};

Management.updateById = (id, management, result) => {
  sql.query(
    `UPDATE registry_managements SET owner_name = ?, owner_phone = ?, date = ?, license_plate = ?, address = ?, vehicle_type_id = ?  WHERE id = ?`,
    [
      management.owner_name,
      management.owner_phone,
      management.date,
      management.license_plate,
      management.address,
      management.vehicle_type_id,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found management with the id
        result({ kind: 'not_found' }, null);
        return;
      }

      // console.log("updated management: ", { id: id, ...management });
      result(null, { id: id, ...management });
    }
  );
};

Management.updatePay = (id, bill, result) => {
  // console.log('bill: ', bill);

  let queryUserFunction = 'INSERT INTO bills (`fee`, `fee_type_id`, `registry_id`) VALUES ?';
  sql.query(
    'UPDATE registry_managements SET pay_at = CURRENT_TIMESTAMP WHERE id = ?',
    id,
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }
      let data = [];
      for (let i = 5; i <= 7; i++) {
        data.push([bill[i - 5], i, id]);
      }
      sql.query(queryUserFunction, [data], (err, res) => {
        if (err) {
          console.log('error: ', err);
          result(null, err);
          return;
        }
        result(null, { id: res.insertId, bill });
      });
    }
  );
};
Management.updateAssignment = (id, staff, result) => {
  sql.query(
    'UPDATE registry_managements SET staff_id = ?, staff_name = ?, car_delivery_time = ?, date_birth = ?, id_card = ?, phone_number = ? WHERE id = ?',
    [
      staff.staff_id,
      staff.staff_name,
      staff.car_delivery_time,
      staff.date_birth,
      staff.id_card,
      staff.phone_number,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found management with the id
        result({ kind: 'not_found' }, null);
        return;
      }
      // console.log('updated management: ', { id: id, ...staff });
      result(null, res);
    }
  );
};
Management.remove = (id, result) => {
  sql.query('DELETE FROM registry_managements WHERE id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found management with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    // console.log("deleted management with id: ", id);
    result(null, res);
  });
};
Management.removeAll = (result) => {
  sql.query('DELETE FROM registry_managements', (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    // console.log(`deleted ${res.affectedRows} management`);
    result(null, res);
  });
};
module.exports = Management;
