const sql = require('./db');

const Registered = function (registered) {
  this.id = registered.id;
  this.owner_name = registered.owner_name;
  this.owner_phone = registered.owner_phone;
  this.date = registered.date;
  this.status = registered.status;
  this.plan_date = registered.plan_date;
  this.payment_date = registered.payment_date;
  this.license_plate = registered.license_plate;
  this.address = registered.address;
  this.staff_id = registered.staff_id;
  this.staff_name = registered.staff_name;
  this.car_delivery_time = registered.car_delivery_time;
};

Registered.getAll = (status, start, end, result) => {
  let filterDate = '';
  let statusName = '';

  if (start !== '' && end !== '') {
    filterDate = ` AND date BETWEEN '${start}' AND '${end}' `;
  }
  if (status !== '' && status !== '3' && status !== undefined) {
    statusName = ` AND status = '${status}' `;
  }
  let query = `SELECT * FROM registry_managements WHERE completed_at is not null ${filterDate} ${statusName} ORDER BY date`;
  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    // console.log('res:', query);
    result(null, res);
  });
};

module.exports = Registered;
