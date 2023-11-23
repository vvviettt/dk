const sql = require("./db");
const uploadFile = function (uploadFile) {
  this.infringe_date = infringe.infringe_date;
  this.license_plate = infringe.license_plate;
  this.violator_name = infringe.violator_name;
  this.infringes_name = infringe.infringes_name;
  this.handling_agency = infringe.handling_agency;
  this.status = infringe.status;
};
uploadFile.create = (row, result) => {
  // console.log(row);
  sql.query(
    "INSERT INTO infringes (license_plate, violator_name, infringe_date, infringes_name, handling_agency, status) VALUES ?",
    [row],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      result(null, { id: res.insertId, row });
    }
  );
};

module.exports = uploadFile;
