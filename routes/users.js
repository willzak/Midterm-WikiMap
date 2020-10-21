/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
// load .env data into process.env
require('dotenv').config();

const express = require('express');
const router  = express.Router();
const app     = express();

const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['thisisasecretkey', 'thisisanothersupersecretkey']
}));


module.exports = (db, database) => {
  router.get("/", (req, res) => { //All users. Dont need??
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //User's profile page
  router.get("/profile", (req, res) => {
    const userId = 1;
    if (!userId) {
      res.send({message: "not logged in"});
      return;
    }

    database.getUserWithId(userId, db)
      .then(user => {
        if (!user) {
          res.send({error: "no user with that id"});
          return;
        }
        res.send({user: {name: user.name, id: userId}});
      })
      .catch(e => res.send(e));
  });

  //Profile info given userId
  router.get("/:id", (req, res) => {
    const userId = req.params.id;
    if (!userId) {
      res.send({message: "not logged in"});
      return;
    }

    db.query(`SELECT * FROM users
    WHERE id = ${userId};`)
      .then(data => {
        const user = data.rows;
        res.json({ user });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/favs/:id", (req, res) => {
    const userId = req.params.id;
    if (!userId) {
      res.send({message: 'not logged in'});
      return
    }

    db.query(`
    SELECT * FROM favourites
    WHERE user_id = ${userId};
    `)
      .then(data => {
        const userFavs = data.rows;
        res.json({ userFavs });
      })
      .catch(err => {
        res
          .status(500)
          .json({error: err.message});
      });
  });

  const login =  function(email, password) {
    return database.getUserWithEmail(email) //Change
      .then(user => {
        return user;
      });
  };

  router.post('/login', (req, res) => {
    const {email, password} = req.body;
    login(email, password)
      .then(user => {
        req.session.userId = user.id;
        res.send({user, map: process.env.MAP_API_KEY});
      })
      .catch(e => {
        console.log('ERROR: ', e);
        res.send(e);
      });
  });

  router.post('/register', (req, res) => {
    const newUser = req.body;
    database.addUser(newUser)
      .then(user => {
        req.session.userId = user.id;
        res.send({user, map: process.env.MAP_API_KEY});
      })
      .catch(e => {
        console.log('ERROR: ', e);
        res.send(e);
      });
  });

  router.post("/profile", (req, res) => {
    const newUserData = req.body;
    database.editUser(newUserData)
      .then(()=> {
        res.send({success: true});
      }).catch(e => {
        console.log('ERROR: ', e);
        res.send(e);
      });
  });

  router.post("/favs/:id", (req, res) => {
    console.log('WHAT IS REQ?', req.body);
  })

  return router;
};
