// const{sequelize,models}=require('./db'); //???????
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const coursesRouter = require('./routes/courses');

// const { User, Course } = models;


const app = express();  //create express app


(async () => {
  try {
    
    // This will Test the connection to the database and log it to console//
    await sequelize.authenticate();
    console.log('Connection to the database was successful');

    // Sync the models
    await sequelize.sync();
    console.log('Models are synchronized with the database');

  }catch(err){
    
    console.log('Connection to the database was unsuccessful' + ' ' + err)

  }
})()

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(morgan('dev')); //setup morgan which gives us HTTP request logging.
app.use(express.json()); //setup request body JSON parsing.
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//add routes
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/courses', coursesRouter);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// // send 404 if no other route matched
// app.use((req, res) => {
//   res.status(404).json({
//     message: 'Route Not Found',
//   });
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

// setup a global error handler
// app.use((err, req, res, next) => {
//   if (enableGlobalErrorLogging) {
//     console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
//   }

//   res.status(err.status || 500).json({
//     message: err.message,
//     error: {},
//   });
// });

// // set our port
// app.set('port', process.env.PORT || 5000);

// // start listening on our port
// const server = app.listen(app.get('port'), () => {
//   console.log(`Express server is listening on port ${server.address().port}`);
// });


module.exports = app;
