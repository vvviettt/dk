const sql = require('./db');

const Deadline = function (deadline) {
  this.license_plate = deadline.license_plate;
  this.infringes_name = deadline.infringes_name;
  this.payment_date = deadline.payment_date;
  this.plan_date = deadline.plan_date;
  this.owner_phone = deadline.owner_phone;
  this.status = deadline.status;
};

Deadline.getAll = (date, value, result) => {
  let filterDate = '';
  if (date !== '') {
    filterDate = ` AND registry_managements.plan_date BETWEEN DATE_SUB('${date}', INTERVAL ${value} DAY) AND  '${date}' `;
  }
  let query = `SELECT registry_managements.license_plate, GROUP_CONCAT(infringes.infringes_name SEPARATOR '; ') as infringes_name, 
  registry_managements.payment_date, registry_managements.plan_date, 
  registry_managements.owner_phone, registry_managements.status
  FROM registry_managements
  LEFT JOIN infringes
  ON registry_managements.license_plate = infringes.license_plate 
  WHERE registry_managements.payment_date is not null AND registry_managements.plan_date is not null AND registry_managements.status = 2 ${filterDate}
  GROUP BY license_plate ORDER BY date`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

module.exports = Deadline;
