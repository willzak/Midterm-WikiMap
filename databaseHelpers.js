/// Users

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

