/// Users



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
const addUser =  function(user, pool) {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES($1, $2, $3)
  RETURNING *;
  `, [user.name, user.email, user.password])
    .then(res => res.rows)
    .catch(err => console.log(err));
};
exports.addUser = addUser;

/**
 *
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
  console.log('*****************', map);
  let queryString = `
  INSERT INTO maps (name, owner_id, description, public_edits, latitude, longitude, zoom)
  VALUES($1, $2, $3, 'true', $4, $5, $6);
  `;
  let values = [map.name, map.owner_id, map.description, map.latitude, map.longitude, map.zoom];
  return pool.query(queryString, values)
    .then(res =>
      pool.query(`SELECT currval('maps_id_seq');`)
        .then(res2 => {
          //console.log("MAP ID: ", res2.rows[0].currval);
          return res2.rows[0].currval;
        }))
    .catch(err => console.log(err));
};

exports.addMap = addMap;


/**
 *
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
return pool.query( `
UPDATE maps
SET name = $1,
    description = $2,
    longitude = $3,
    latitude = $4,
    zoom = $5
WHERE id = $6


`,[map.name, map.description, map.center.lng, map.center.lat, map.zoom, map.id])
.then(res =>
pool.query(`
SELECT currval('maps_id_seq');`)
.then(res2 => {
  //console.log("MAP ID: ", res2.rows[0].currval);
  return res2.rows[0].currval;



;}))
.catch(err => console.log(err));
}

exports.editMap = editMap;

const addPoint = function(point, pool) {
  return pool.query( `
  INSERT INTO points (creator_id, map_id, title, description, image, longitude, latitude)
  VALUES($1, $2, $3, $4, $5, $6, $7);


  `,[map.owner_id, map.name, map.description, map.center.lng, map.center.lat, map.zoom])
  .then(res =>
    pool.query(`
    SELECT currval('maps_id_seq');`)
    .then(res2 => {
      //console.log("MAP ID: ", res2.rows[0].currval);
      return res2.rows[0].currval;



  ;}))
  .catch(err => console.log(err));
}

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
    const queryString = `
    SELECT * FROM points
    WHERE map_id = $1;
    `;

    return pool.query(queryString, [map_id])
    .then(res => res.rows)
  };
  exports.getPointsByMap = getPointsByMap;

  /**
   * Get the center object for a map
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
