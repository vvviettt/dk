const sql = require('./db');

const Category = function (category) {
  this.id = category.id;
  this.name = category.name;
  this.tariff = category.tariff;
  this.license_fee = category.license_fee;
};

Category.create = (newCategory, result) => {
  sql.query('INSERT INTO vehicle_categories SET ?', newCategory, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    // console.log("created vehicle_categories: ", { id: res.insertId, ...newCategory });
    result(null, { id: res.insertId, ...newCategory });
  });
};
Category.findById = (id, result) => {
  sql.query(`SELECT * FROM vehicle_categories WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    if (res.length) {
      // console.log("found category: ", res[0]);
      result(null, res[0]);
      return;
    }
    // not found category with the id
    result({ kind: 'not_found' }, null);
  });
};
Category.getAll = (name, result) => {
  let query = `SELECT vehicle_categories.id ,vehicle_categories.name ,vehicle_categories.tariff , vehicle_categories.license_fee , CASE
  WHEN vehicle_types.id is null then 0
  ELSE  1
  end  as status 
FROM vehicle_categories
LEFT JOIN vehicle_types
ON vehicle_categories.id = vehicle_types.vehicle_category_id and vehicle_categories.delete_at is null GROUP BY vehicle_categories.id ORDER BY vehicle_categories.id DESC;`;
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

Category.updateById = (id, category, result) => {
  // console.log("content:", category, id);
  sql.query(
    `UPDATE vehicle_categories SET name = ?, tariff = ?, license_fee = ? WHERE id = ?`,
    [category.name, category.tariff, category.license_fee, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found category with the id
        result({ kind: 'not_found' }, null);
        return;
      }

      // console.log("updated category: ", { id: id, ...category });
      result(null, { id: id, ...category });
    }
  );
};
Category.remove = (id, result) => {
  sql.query('DELETE FROM vehicle_categories WHERE id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found category with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    // console.log("deleted category with id: ", id);
    result(null, res);
  });
};
Category.removeAll = (result) => {
  sql.query('DELETE FROM vehicle_categories', (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    // console.log(`deleted ${res.affectedRows} category`);
    result(null, res);
  });
};

Category.uploadFile = (row, result) => {
  sql.query(
    'INSERT INTO vehicle_categories (name, tariff, license_fee) VALUES ?',
    [row],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }
      result(null, { id: res.insertId, row });
    }
  );
};
module.exports = Category;
