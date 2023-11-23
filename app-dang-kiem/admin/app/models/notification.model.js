const sql = require("./db");

const Notification = function (notification) {
  this.day_before_registry = notification.day_before_registry;
  this.day_before_expired = notification.day_before_expired;
  this.time = notification.time;
  this.status = notification.status;
  this.id = notification.id;
};

Notification.findById = (result) => {
  sql.query(`SELECT * FROM notification_setting WHERE id = 1`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      //   console.log("found notification: ", res[0]);
      result(null, res[0]);
      return;
    }
    // not found notification with the id
    result({ kind: "not_found" }, null);
  });
};
Notification.updateById = (notification, result) => {
  // console.log(notification, id);
  sql.query(
    `UPDATE notification_setting SET day_before_registry=?, day_before_expired=?, time=?,status=? WHERE id = 1`,
    [
      notification.day_before_registry,
      notification.day_before_expired,
      notification.time,
      notification.status,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found notification with the id
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, notification);
    }
  );
};

module.exports = Notification;
