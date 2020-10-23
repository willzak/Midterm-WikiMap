/*
 * All routes for Maps are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const e = require('express');
const express = require('express');
const { Pool } = require('pg');
const router  = express.Router();

module.exports = (db, database) => {
  //loads all maps
  router.get("/list/:restriction", (req, res) => {
    const restriction = req.params.restriction;
    const userId = req.session.userId;
    database.getMapList(restriction, userId)
      .then(data => {
        const maps = data;
        res.json({ maps });
      })
      .catch(e => {
        console.log('ERROR: ', e);
        res.send(e);
      });
  });

  router.get("/points", (req, res) => {
    const id = req.query.id;
    database.getPointsByMap(id)
      .then(data=>{
        data.latitude = parseFloat(data.latitude);
        data.longitude = parseFloat(data.longitude);
        res.send(data)}
      )
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });


  });

  router.get("/points/:id", (req, res) => {
    const id = req.params.id;
    database.getPointsById(id)
      .then(data=>{
        data.latitude = parseFloat(data.latitude);
        data.longitude = parseFloat(data.longitude);
        res.send(data)}
      )
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });


  });

  //get favourites of maps
  router.get("/favs/", (req, res) => {
    const userId = req.session.id;
    console.log('user id ', userId);

    database.getFavs(userId)
      .then(data => {
        const favs = data;
        res.json({ favs });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //loads map by map_id
  router.get("/:id", (req, res) => {
    const id = req.params.id;
    database.getMapByID(id, db)
      .then(data => {
        res.json({ data });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //route to add point
  router.post("/add_point", (req, res) => {
    point = req.body;
    point.user_id = req.session.userId;
    const id = parseInt(point.id);

    if(id === 0){
      database.addPoint(point);
    } else {
      database.editPoint(point, id);
    }

    res.json(point);
  });

  router.post("/points/delete", (req, res) => {
    point = req.body;
    const id = parseInt(point.id);


    database.deletePoint(id);
    res.json(point);
  });

  //add or remove map from favs
  router.post("/favs/:mapId", (req, res) => {
    const userId = req.body.userId;
    const mapId = req.body.mapId;
    const liked = req.body.liked;
    if (liked === 'true') {
      console.log("****************maps true", liked);
      database.removeFav(userId, mapId)
        .then((result) => {
          console.log('REMOVED users post req: ', result);
          res.send(result);
        });
    } else {
      console.log("****************maps false", liked);
      database.addFav(userId, mapId)
        .then((result) => {
          console.log('ADDED users post req: ', result);
          res.send(result);
        });
    }
  });

  //adds new map or edits existing map based on map_id is null or not
  router.post("/:id", (req, res) => {
    const point = req.body.point;
    const id = parseInt(req.params.id);
    if (id === 0) {
      const map = req.body;
      database.addMap(map,db)
        .then((id)=> {
          res.send({id});
        });
    } else {
      const map = req.body;
      database.editMap(map,db)
        .then((id)=> {
          res.send({id});
        });
    }
  });

  return router;
};
