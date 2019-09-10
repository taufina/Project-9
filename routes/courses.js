const express = require('express');
const router = express.Router();
const {Course} = require('../models');
const authenticateUser = require('./authentication');
const { check, validationResult } = require('express-validator');

//Validations
const titleValidator = check('title')
  .exists({checkNull:true, checkFalsy:true})
  .withMessage('Please provide a value for "title"');
const descriptionValidator = check('lastName')
  .exists({checkNull:true, checkFalsy:true})
  .withMessage('Please provide a value for "description"');
const userIdValidator = check('userId')
  .exists({checkNull:true, checkFalsy:true})
  .withMessage('Please provide a value for "userId"');
  

/* GET home page. */
router.get('/', function(req, res, next) {
  Course.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
    .then(courses => {
        if (courses) {
          res.json(courses);
        } else {
          const error = new Error('Could not find courses.');
          error.status = 400;
          next(error);
        }
    }).catch(err => {res.json({message:err.message})});
  });



router.get('/:id', function (req, res, next) {
    Course.findByPk(req.params.id).then((course) => {
      if(course){
        res.status(200).json(course).end();
      } else {
        const error = new Error('No course was found.');
        error.status = 404;
        next(error);      
      }
    }).catch(function(err){
      res.send(500);
    });
});



/* Posts a new book to the database */
router.post('/', [
  //validation will run first, before we attempt to do anything with the request data.
  titleValidator, 
  descriptionValidator, 
  userIdValidator 
], authenticateUser, (req, res, next)=> {
  //attempt to get the validation result from the Request object.
  const errors = validationResult(req);

  //If there are validation errors:
  if(!errors.isEmpty()){
    //Use the Array 'map()' method to get a list o error messages.
    const errorMessages = errors.array().map(error=>error.msg);

    //Return the validation errors to the client.
    return res.status(400).json({errors:errorMessages});
  } else {
    const courseData = {
      title: req.body.title,
      description: req.body.description,
      userId: req.body.userId
    }
    Course.create(courseData).then(()=>{
      res.location(`/api/courses/${Course.id}`);
      res.status(201).end();
    }).catch(function(err){
      if(err.name === "SequelizeValidationError"){
        return res.status(400).json({message: "Please fill out all of the fields"})
      } else {
        res.json({message: err.message});
       // throw err;
      }
    }).catch(function(err){
      res.json(500, err);
    });
  }
});

                      

//EDIT COURSE

router.put('/:id', [
  // Validations
  titleValidator, 
  descriptionValidator, 
  userIdValidator 
], authenticateUser, (req, res, next) => {

  const errors = validationResult(req);

  // If there are validation errors...
  if(!errors.isEmpty()){
    //Use the Array 'map()' method to get a list o error messages.
    const errorMessages = errors.array().map(error=>error.msg);

    //Return the validation errors to the client.
    return res.status(400).json({errors:errorMessages}); 
  } else {
    Course.findByPk(req.params.id).then((course) => {
        if (course) {
          if(req.currentUser.id === course.userId) {
            course.update(req.body).then(() => res.status(204).end());
          } else {
            res.status(403).json({message: 'Sorry, you are not authorized to edit this course.'});
          }
        } else {
          res.status(404).json({message: "Oops! No course was found."});
        }
    }).catch(err => {
      if(err.name === 'SequelizeValidationError') {
        res.status(400).json({message: "Hmm...Something's not right. Please fill out all the required fields."})
      } else {
        res.json({message: err.message});
      }
      next(err);
    });
}
});


// DELETE a course
router.delete("/:id", authenticateUser, (req, res, next) => {
  Course.findByPk(req.params.id).then((course) => {
      if (course) {
        if(req.currentUser.id === course.userId) {
          course.destroy();
          res.status(204).end();
        } else {
          const error = new Error('Sorry, you are not authorized to delete this course.');
          error.status = 403;
          next(error);
        } 
      } else {
        const error = new Error('No course was found.');
        error.status = 404;
        next(error);
      }
    }).catch(function(err){
      const error = new Error('Server error');
      error.status = 500;
      next(error);
    });
  });

module.exports = router;