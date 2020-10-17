/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
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

  router.get("/profile", (req, res) => { //Your profile page
    const userId = req.session.userId;
    if (!userId) {
      res.send({message: "not logged in"});
      return;
    }
    //USER HELPER FUNCTION???
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const user = data.row;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => { //Profile page given userId
    const userId = req.params.id;
    if (!userId) {
      res.send({message: "not logged in"});
      return;
    }
    //USER HELPER FUNCTION???
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

  const login =  function(email, password) {
    return database.getUserWithEmail(email) //Change
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {

        return user;
      }

      return null;
    });
  };

  router.post('/login', (req, res) => {
    const {email, password} = req.body;
    login(email, password)
      .then(user => {
        if (!user) {
          res.send({error: "error"});
          return;
        }
        req.session.userId = user.id;
        res.send({user: {name: user.name, email: user.email, id: user.id}});
      })
      .catch(e => res.send(e));
  });

  router.post('/logout', (req, res) => {
    req.session.userId = null;
    res.send({});
  });

  return router;
};
