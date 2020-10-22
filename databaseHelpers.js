const cookieSession = require('cookie-session');
const { Pool } = require('pg');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'midterm'
});

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT * FROM users
  WHERE email = $1
  `, [email])
    .then(res => res.rows[0]);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id, pool) {
  return pool.query(`
  SELECT * FROM users
  WHERE id = $1
  `, [id])
    .then(res => {
      console.log(res.rows[0]);
      return res.rows[0]});
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(newData) {
  let properties = '';
  let references = '';
  let values = [];
  for (const property in newData) {
    values.push(newData[property]);
    if (values.length > 1) {
      properties += ', ';
      references += ', ';
    }
    properties += `${property}`;
    references += `$${values.length}`;
  }
  let queryString = `
    INSERT INTO users (${properties})
    VALUES(${references})
    RETURNING *;
    `;
  return pool.query(queryString, values)
    .then(res => res.rows[0])
    .catch(err => console.log(err));
};
exports.addUser = addUser;

/**
 * Using the profile form, this function updates changes a user inputs on their profile
 * @param {Object} newData
 * @reutrn update to the profile table
 */
const editUser = function(newData) {
  let changes = '';
  let values = [];
  for (const property in newData) {
    if (property !== 'id') {
      values.push(newData[property]);
      if (values.length > 1) changes += ', ';
      changes += `${property} = $${values.length}`;
    }
  }
  let queryString = `
  UPDATE users
  SET ${changes}
  WHERE id = ${newData.id}
  `;
  return pool.query(queryString, values)
    .then(res => {
      return;
    })
    .catch(err => console.log(err));
};
exports.editUser = editUser;

/**
 * Adds a map to database
 * @param {
      id: req.body.map_id,
      owner_id: owner_id,
      name: req.body.name,
      description: req.body.description,
      zoom: req.body.zoom,
      center: req.body.center
    } map
 * @param {*} pool
 */
const addMap = function(map, pool) {
  let queryString = `
  INSERT INTO maps (name, owner_id, description, public_edits, latitude, longitude, zoom)
  VALUES($1, $2, $3, 'true', $4, $5, $6);
  `;
  let values = [map.name, map.owner_id, map.description, map.latitude, map.longitude, map.zoom];
  return pool.query(queryString, values)
    .then(res =>
      pool.query(`SELECT currval('maps_id_seq');`)
        .then(res2 => {
          return res2.rows[0].currval;
        }))
    .catch(err => console.log(err));
};

exports.addMap = addMap;


/**
 * Changes a map currently in the database
 * @param {
  id: req.body.map_id,
  owner_id: owner_id,
  name: req.body.name,
  description: req.body.description,
  zoom: req.body.zoom,
  center: req.body.center
} map
* @param {*} pool
*/
const editMap = function(map, pool) {
  let queryString = `
  UPDATE maps
  SET name = $1,
      description = $2,
      longitude = $3,
      latitude = $4,
      zoom = $5
  WHERE id = $6
  `;
  return pool.query(queryString ,[map.name, map.description, map.longitude, map.latitude, map.zoom, map.id])
    .then(res => map.id
      )
    .catch(err => console.log(err));
};

exports.editMap = editMap;

const addPoint = function(point) {
  console.log('POINT INSIDE ADD POINT: ', point);
  return pool.query( `
  INSERT INTO points (creator_id, map_id, title, description, image, longitude, latitude)
  VALUES($1, $2, $3, $4, $5, $6, $7);
  `,[point.user_id, point.map_id, point.title, point.text, point.image, point.lng, point.lat])
    .then(res => res.row)
    .catch(err => console.log(err));
};

exports.addPoint = addPoint;


// FUNCTIONS FOR MAP VIEWS

/**
 * Get a specific map using id
 * @param {String} id
 * @return {Promise<{}>} A promise to the user
 */
const getMapByID = function(id, pool) {
  const queryString = `
  SELECT * FROM maps
  WHERE id = $1;
  `;

  return pool.query(queryString, [id])
    .then(res => res.rows[0])
};
exports.getMapByID = getMapByID;

/**
 * Get a specific map using map name
 * @param {String} name
 * @return {Promise<{}>} A promise to the user
 */
const getMapByName = function(name) {
  const queryString = `
  SELECT * FROM maps
  WHERE name = $1;
  `;

  return pool.query(queryString, [name])
    .then(res => res.rows[0])
};
exports.getMapByName = getMapByName;

/**
  * Get points that belong to a certain map
  * @param {Integer} map_id
  * @return {Promise<{}>} A promise to the user
  */
const getPointsByMap = function(map_id) {
  console.log('MAP_ID: ', map_id);
  const queryString = `
    SELECT * FROM points
    WHERE map_id = $1;
    `;

  return pool.query(queryString, [map_id])
    .then(res => res.rows)
};
exports.getPointsByMap = getPointsByMap;

/**
   * Get the center object (latitude and longitude) for a map
   * @param {id: integer, owner_id: integer, name: string, city: string, description: string, public_edits: boolean, latitude: integer, longitude: integer, zoom: integer}
   * @return {Promise<{}>}
   */
const getCenterOfMap = function(map_id) {
  const queryString = `
    SELECT latitude, longitude
    FROM maps
    WHERE id = $1;
    `;

  return pool.query(queryString, [map_id])
    .then(res => {
      const center = {};
      center[lat] = res.rows[0].longitude;
      center[lng] = res.rows[0].latitude;
      return center;
    });
};
exports.getCenterOfMap = getCenterOfMap;

/**
 * Gets the appropriate query for the list view of maps based on user input of buttons
 * @param {String} restriction
 * @param {Integer} userID
 * @return query object to specified route
 */
const getMapList = function(restriction, userID) {
  //query string for all maps
  let queryString = `
  SELECT maps.*, users.name as owner_name
  FROM maps
  JOIN users on users.id = maps.owner_id`;
  let values = undefined;

  //query string for maps favourited by user
  if (restriction === 'favs') {
    queryString = `SELECT maps.*, users.name as owner_name
    FROM users JOIN favourites ON user_id = users.id
    JOIN maps ON maps.id = favourites.map_id
    WHERE users.id = $1;`;
    values = [userID];
  }

  //query string for maps a user contributed to
  if (restriction === 'cont') {
    queryString = `
    SELECT * FROM
    (SELECT maps.*, users.name AS owner_name
      FROM maps JOIN users ON users.id = maps.owner_id
      WHERE users.id = $1
    UNION
    SELECT points_part.*, users.name AS owner_name FROM
      (SELECT maps.*
        FROM users JOIN points ON creator_id = users.id
        JOIN maps ON map_id = maps.id
        WHERE users.id = $1
      ) AS points_part
      JOIN users ON points_part.owner_id = users.id) AS map_list
    ORDER BY id`;
    values = [userID];
  }

  //query string for maps a user favourited AND contributed to
  if (restriction === 'favcont') {
    queryString = `
    SELECT * FROM
    (SELECT maps.*, users.name as owner_name
      FROM users JOIN favourites ON user_id = users.id
      JOIN maps ON maps.id = favourites.map_id
      WHERE users.id = $1
    UNION
    SELECT * FROM
      (SELECT maps.*, users.name AS owner_name
        FROM maps JOIN users ON users.id = maps.owner_id
        WHERE users.id = $1
      UNION
      SELECT points_part.*, users.name AS owner_name FROM
        (SELECT maps.*
          FROM users JOIN points ON creator_id = users.id
          JOIN maps ON map_id = maps.id
          WHERE users.id = $1
        ) AS points_part
        JOIN users ON points_part.owner_id = users.id) AS sub_list) AS map_list
    ORDER BY id`;
    values = [userID];
  }

  if (values) {
    return pool.query(queryString, values)
      .then(res => res.rows)
      .catch(err => console.log(err));
  }

  return pool.query(queryString)
    .then(res => res.rows)
    .catch(err => console.log(err));
};
exports.getMapList = getMapList;

/**
 * Adds a user id and map id to the favourites table
 * @param {Integer} user_id
 * @param {Integer} map_id
 * @return an insert command to the favourites table
 */
const addFav = function(user_id, map_id, pool) {
  let queryString = `
  INSERT INTO favourites (user_id, map_id)
  VALUES ($1, $2)
  RETURNING *;
  `;
  let values = [user_id, map_id];

  return pool.query(queryString, values)
    .then(res => res.rows)
    .catch(err => console.log(err));
}
exports.addFav = addFav;

/**
 * Removes a user id and map id from the favourites table
 * @param {Integer} user_id
 * @param {Integer} map_id
 * @return a delete command to the favourites table
 */
const removeFav = function(user_id, map_id, pool) {
  let queryString = `
  DELETE FROM favourites (user_id, map_id)
  WHERE user_id = $1 AND map_id = $2
  RETURNING *;
  `;
  let values = [user_id, map_id];

  return pool.query(queryString, values)
    .then(res => res.rows)
    .catch(err => console.log(err));
}
exports.removeFav = removeFav;
