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
  // .isLength({ min: 8, max: 20 })
  // .withMessage('Please provide a value for "password" that is between 8 and 20 characters in length');


// const authenticateUser = (req, res, next) => {
//   next();
// }

// /* GET users listing. */
// // router.get('/', function(req, res, next) {
// //   res.json({
// //     firstName: "Nabila",
// //     lastName: "Taufiq"
// //   })
// // });

// const users = [];
router.get('/', authenticateUser, function(req, res, next) {

  // const { firstName, lastName, emailAddress } = req.currentUser;

  return res.status(200).json({
    userId: req.currentUser.get("id"),
    firstName: req.currentUser.get("firstName"),
    lastName: req.currentUser.get("lastName"),
    emailAddress: req.currentUser.get("emailAddress")
  })
  // return res.status(200).json({
  //   id:`${req.currentUser.id}`,
  //   name: `${firstName} ${lastName}`,
  //   email: emailAddress
  // });

  // User.findAll()
  //     .then(users => {
  //         res.json(users);
  //     })
  //     .catch(err => {
  //         err.statusCode = err.statusCode || 500;
  //         throw err;
  //     });
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
      //Use the Array 'map()' method to get a list o error messages.
      const errorMessages = errors.array().map(error=>error.msg);

      //Return the validation errors to the client.
      return res.status(400).json({errors:errorMessages});
    }

  //let {title, id, userId, description} = req.body;
  // if (req.body.email &&
  //   req.body.username &&
  //   req.body.password) {
      // const user = new User({
      //   firstName: req.body.firstName,
      //   lastName: req.body.lastName,
      //   emailAddress: req.body.emailAddress,
      //   password: bcrypt.hashSync(req.body.password, 10) // uses bcrypt to hash the password.
      // });


    //get user data from request body:
    const userData = {
      emailAddress: req.body.emailAddress,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: bcryptjs.hashSync(req.body.password) //hash the new user's password
    }
  
    // User.findOne({
    //   where: {}
    // })
    //use schema.create to insert data into the db

    
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
  
  
//   Course.create(req.body).then(function(course){
//     res.redirect("/users/" + user.id);
//     // res.redirect("/");
//   }).catch(function(err){
//     if(err.name === "SequelizeValidationError"){
//       return res.status(400).json({message: "Something is wrong"})
//     } else {
//       res.json({message: 'what went wrong'});
//       throw err;
//     }
//   }).catch(function(err){
//     res.json(500, err);
//   });
});



module.exports = router;
