/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const e = require('express');
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
    database.getMapByID(id, db)
      .then(data => {
        //const map = data.rows;
        res.json({ data });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/:id", (req, res) => {



    const point = req.body.point;
    console.log("MAP: ", map);
    if(!req.body.map_id){
      const owner_id = req.session.userId;
      console.log(req.body);
      const map = {
        id: null,
        owner_id: owner_id,
        name: req.body.name,
        description: req.body.description,
        zoom: req.body.zoom,
        center: req.body.center
      };


      database.addMap(map,db)
        .then((map_id)=> {
          console.log("HERE: ", map_id);


        });
    } else {
      const map = {
        id: req.body.map_id,

        name: req.body.name,
        description: req.body.description,
        zoom: req.body.zoom,
        center: req.body.center
      };

      const point = {
        creator_id: req.session.userId,
        map_id: req.body.map_id,
        title: req.body.point_title,
        description: req.body.point_description,
        image: req.body.point_image,
        longitude: req.body.point_lng,
        latitude: req.body.point_lat
      }
      database.editMap(map,db);
      database.addPoint(point, db);
    }


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
