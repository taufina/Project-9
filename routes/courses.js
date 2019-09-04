const express = require('express');
const router = express.Router();
const {Course} = require('../models');
// const User = require("./User");


/* GET home page. */
router.get('/', function(req, res, next) {
    Course.findAll()
        .then(courses => {
            res.status(200).json(courses);
        })
        .catch(err => {
            err.statusCode = err.statusCode || 500;
            throw err;
        });
});

// router.post('/', (req, res)=>{
  
// });

router.get('/:id', function (req, res, next) {
    Course.findByPk(req.params.id).then((course) => {
      if(course){
        res.status(200).json(course).end();
        // render('delete', { book: book, title: 'Delete Book' });
      }else {
        res.send(404);
      }
    }).catch(function(err){
      res.send(500);
    });
  });

// router.post('/', function(req, res, next) {
//     Course.findAll()
//         .then(courses => {
//             res.json(courses);
//         })
//         .catch(err => {
//             err.statusCode = err.statusCode || 500;
//             throw err;
//         });
// });


/* Posts a new book to the database */
router.post('/', function(req, res, next) {
  Course.create(req.body).then(function(course){
    // res.redirect("/courses/" + course.id);
    let {title, id, userId, description} = req.body;
    // res.redirect("/");

  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      res.json({errors: err.errors})
    } else {
      throw err;
    }
  }).catch(function(err){
    res.json(500, err);
  });
});

module.exports = router;