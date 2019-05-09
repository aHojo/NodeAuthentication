// Express modules
const createError = require('http-errors');
const express = require('express');
const sessions = require('express-session');
const expressValidator = require('express-validator');

// Passport modules
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Password hashing
const bcrypt = require('bcryptjs');

const multer = require('multer');
const upload = multer({'dest': './uploads'})


// Database Modules
const mongo = require('mongodb');
const mongoose = require('mongoose');
const db = mongoose.connection;

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//For login messages
const flash = require('express-flash');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handle sessions 
app.use(sessions({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

//Messages middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// ROUTES
app.use('/', indexRouter);
app.use('/users', usersRouter);




// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));




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
  res.render('error');
});

module.exports = app;
