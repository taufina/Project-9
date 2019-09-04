const express = require('express');
const router = express.Router();
const {User} = require('../models');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.json({
//     firstName: "Nabila",
//     lastName: "Taufiq"
//   })
// });

// const users = [];
router.get('/', function(req, res, next) {
  User.findAll()
      .then(users => {
          res.json(users);
      })
      .catch(err => {
          err.statusCode = err.statusCode || 500;
          throw err;
      });
});
// router.get('/', function(req, res, next){
//   res.json(users);
// });

router.post('/users', (req, res) => {
  //Get the user from the request body.
  const user = req.body;

  v
  //Add the user to the 'users' array.
  users.push(user);
  //Set the status to 201 Created and end the response.
  res.status(201).end();
});



module.exports = router;
