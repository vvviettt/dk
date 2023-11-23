const sql = require('./db');

const Type = function (type) {
  this.id = type.id;
  this.name = type.name;
  this.road_fee = type.road_fee;
  this.vehicle_category_id = type.vehicle_category_id;
};

Type.create = (newType, result) => {
  sql.query('INSERT INTO vehicle_types SET ?', newType, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    }
    // console.log("created vehicle_types: ", { id: res.insertId, ...newType });
    result(null, { id: res.insertId, ...newType });
  });
};
Type.findById = (id, result) => {
  sql.query(
    `SELECT  vehicle_types.id,vehicle_types.name,vehicle_types.road_fee, vehicle_categories.id as category_id, vehicle_categories.name as category_name
  FROM (vehicle_types
  INNER JOIN vehicle_categories ON vehicle_types.vehicle_category_id = vehicle_categories.id) WHERE vehicle_types.id = ${id}`,
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(err, null);
        return;
      }
      if (res.length) {
        // console.log("found type: ", res[0]);
        result(null, res[0]);
        return;
      }
      // not found type with the id
      result({ kind: 'not_found' }, null);
    }
  );
};
Type.getCategories = (name, result) => {
  let query = 'SELECT * FROM vehicle_categories';
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
Type.getAll = (name, result) => {
  let query = `SELECT vehicle_types.id, vehicle_types.name, vehicle_types.road_fee, CASE
  WHEN registry_managements.vehicle_type_id is null AND cars.vehicle_type_id is null then 0
  ELSE  1
  end  as status 
FROM vehicle_types
LEFT JOIN registry_managements
ON vehicle_types.id = registry_managements.vehicle_type_id
LEFT JOIN cars
ON vehicle_types.id = cars.vehicle_type_id    
GROUP BY vehicle_types.id ORDER BY vehicle_types.id DESC`;
  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
  }
  sql.query(query, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    // console.log("type: ", res);
    result(null, res);
  });
};

Type.updateById = (id, type, result) => {
  // console.log(type, id);
  sql.query(
    `UPDATE vehicle_types SET name = ?, vehicle_category_id = ?, road_fee = ? WHERE id = ?`,
    [type.name, type.vehicle_category_id, type.road_fee, id],
    (err, res) => {
      if (err) {
        console.log('error: ', err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found type with the id
        result({ kind: 'not_found' }, null);
        return;
      }

      // console.log("updated type: ", { id: id, ...type });
      result(null, { id: id, ...type });
    }
  );
};
Type.remove = (id, result) => {
  sql.query('DELETE FROM vehicle_types WHERE id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found type with the id
      result({ kind: 'not_found' }, null);
      return;
    }
    // console.log("deleted type with id: ", id);
    result(null, res);
  });
};
Type.removeAll = (result) => {
  sql.query('DELETE FROM vehicle_types', (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
      return;
    }
    // console.log(`deleted ${res.affectedRows} type`);
    result(null, res);
  });
};

Type.uploadFile = (row, result) => {
  sql.query(
    'INSERT INTO vehicle_types (name, vehicle_category_id, road_fee) VALUES ?',
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
module.exports = Type;
