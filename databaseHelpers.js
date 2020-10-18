/// Users

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'wikimap'
});

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email, pool) {
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

const addMap = function(map, pool) {
  return pool.query( `
  INSERT INTO maps (name, description, public_edits)
  VALUES($1, $2, 'true');


  `,[map.name, map.description])
  .then(res =>
    pool.query(`
    SELECT currval('maps_id_seq');`)
    .then(res2 => {
      //console.log("MAP ID: ", res2.rows[0].currval);
      return res2.rows[0].currval;



  ;}))
  .catch(err => console.log(err));
}

exports.addMap = addMap;

const addOwner = function(map_id, owner_id, pool) {
  return pool.query( `
  INSERT INTO owner (owner_id, , map_id)
  VALUES($1, $2);


  `,[owner_id, map_id])
  .then(res => res.row )
  .catch(err => console.log(err));
}

exports.addOwner = addOwner;

// FUNCTIONS FOR MAP VIEWS

/**
 * Get a specific map using id
 * @param {{id: integer, name: string, city: string, description: string, public_edits: boolean}}
 * @return {Promise<{}>} A promise to the user
 */

 const getMapByID = function(id) {
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
 * @param {{id: integer, name: string, city: string, description: string, public_edits: boolean}}
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
  * @param {{creator_id: integer, map_id: integer, title: string, description: string, image: string, longitude: integer, latitude: integer}}
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
