/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
//Database helpers



module.exports = (db, database) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM maps;`;
    console.log(query);
    db.query(query)
      .then(data => {
        const maps = data.rows;
        res.json({ maps });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    const id = req.params.id;
    let query = `SELECT * FROM maps
    WHERE id = ${id};`;
    console.log(query);
    db.query(query)
      .then(data => {
        const map = data.rows;
        res.json({ map });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  return router;
};
