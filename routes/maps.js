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

  router.post("/:id", (req, res) => {
    //const userId = req.session.userId;
    console.log(req.body);
    const map = {

      name: req.body.name,
      description: req.body.description,
      zoom: req.body.zoom,
      center: req.body.center
    };


    const points = req.body.points;
    console.log("MAP: ", map);
    database.addMap(map,db)
    .then((map_id)=> {
      console.log("HERE: ", map_id);
      //database.addPoints(points,db)
    });

  });


  return router;
};
/*
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"new map","description":"this is new"}' \
  http://localhost:8080/api/maps/4

  */
// router.get("/:id", (req, res) => {
//   const id = req.params.id;
//   let query = `SELECT * FROM maps
//   WHERE id = ${id};`;
//   console.log(query);
//   db.query(query)
//     .then(data => {
//       const map = data.rows;
//       res.json({ map });
//     })
//     .catch(err => {
//       res
//         .status(500)
//         .json({ error: err.message });
//     });
// });

// router.post("/:id", (req, res) => {
//   const id = req.params.id;
//   let query = `SELECT * FROM maps
//   WHERE id = ${id};`;
//   console.log(query);
//   db.query(query)
//     .then(data => {
//       const map = data.rows;
//       res.json({ map });
//     })
//     .catch(err => {
//       res
//         .status(500)
//         .json({ error: err.message });
//     });
// });
