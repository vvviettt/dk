const sql = require('./db');

const Profile = function (profile) {
  this.id = profile.id;
  this.name = profile.name;
  this.status = profile.status;
};

Profile.create = (newProfile, result) => {
  sql.query('INSERT INTO profile (`name`, `status`) VALUES ?', [newProfile], (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newProfile });
  });
};

Profile.getAll = (result) => {
  let query = 'SELECT * FROM profile';
  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Profile.getHotLine = (result) => {
  let query = 'SELECT * FROM hot_line';
  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};
Profile.updateById = (phone, result) => {
  // console.log(infringe, id);
  sql.query(`UPDATE hot_line SET phone_number = ? WHERE id = '1'`, [phone], (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    result(null, { phone });
  });
};

Profile.remove = (id, result) => {
  sql.query('DELETE FROM profile_setting WHERE id = ?', id, (err, res) => {
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
Profile.removeAll = (result) => {
  sql.query('DELETE FROM profile', (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};
module.exports = Profile;
