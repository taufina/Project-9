const express = require('express');
const router = express.Router();
const {User} = require('../models');
const bcryptjs = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const authenticateUser = require('./authentication');


//validations:
const firstNameValidator = check('firstName')
  .exists({checkNull:true, checkFalsy:true})
  .withMessage('Please provide a value for "first name"');
const lastNameValidator = check('lastName')
  .exists({checkNull:true, checkFalsy:true})
  .withMessage('Please provide a value for "last name"');
const emailAddressValidator = check('emailAddress')
  .exists({checkNull:true, checkFalsy:true})
  .withMessage('Please provide a value for "email"')
  .isEmail()
  .withMessage('Please provide a valid email address for "email"');
const passwordValidator = check('password')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "password"');


//Get the current user.
router.get('/', authenticateUser, function(req, res, next) {

  return res.status(200).json({
    userId: req.currentUser.get("id"),
    firstName: req.currentUser.get("firstName"),
    lastName: req.currentUser.get("lastName"),
    emailAddress: req.currentUser.get("emailAddress")
  })
});

/* Posts a new user to the database */
router.post('/', [
    //validation will run first, before we attempt to do anything with the request data.
    firstNameValidator, 
    lastNameValidator, 
    emailAddressValidator, 
    passwordValidator
], (req, res, next)=> {
    //attempt to get the validation result from the Request object.
    const errors = validationResult(req);

    //If there are validation errors:
    if(!errors.isEmpty()) {
      //Use the Array 'map()' method to get a list of error messages.
      const errorMessages = errors.array().map(error=>error.msg);

      //Return the validation errors to the client.
      return res.status(400).json({errors:errorMessages});
    }



    //get user data from request body:
    const userData = {
      emailAddress: req.body.emailAddress,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: bcryptjs.hashSync(req.body.password) //hash the new user's password
    }

    //Create user with the user data provided.
    User.create(userData).then(()=>{
      res.location('/');
      res.status(201).end();
    }).catch(function(err){
      if(err.name === "SequelizeUniqueConstraintError"){
        return res.status(400).json({message: 'That email address already exists. Please try another email address.'}) //next
      } else {
        res.status(400).json({message:err.message });
        throw err;
      }
    }).catch(function(err){
      res.json(500, err);
    });
});



module.exports = router;
