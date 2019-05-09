const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads'});
const { check, validationResult } = require('express-validator/check');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
let newUser = null;

passport.serializeUser(function(user, done) {
  done(null, user.id);
}); 
passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid Password'});
      }
    });
  });
}));



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
  
});
router.post('/register', [ upload.single('profileimage'),
  check('name', "Name field is required").isLength({ min: 3}),
  check('email', "Email field is required").isLength({min: 5}),
  check('email', "Email Needs to be an email").isEmail(),
  check('username', "username field is required").isLength({min: 3}),
  check('password', "Password min length is 8").isLength({ min: 8}),
  check('password2', 'Password field must have the same value as the password field')
    .exists()
    .custom((value, { req }) => value === req.body.password)
  ],
  function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  

  // Form Validator
  // req.checkBody('name', 'Name field is required').notEmpty();

  // Check Errors
  const errors = validationResult(req);

  if (req.file) {
    console.log("Uploading file...");
    console.log(req.file);
    var profileimage = req.file.filename;
  } else {
    console.log('No file uploaded.');
    var profileimage = 'noimage.jpg';
  }

  if (!errors.isEmpty()) {
    // return res.status(422).json({ errors: errors.array() });
    res.render('register', {errors: errors.array()});
  } else {
    console.log('Hello');
    newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileimage
    });
  }
  
  User.createUser(newUser, function(err, user){
    if (err) throw err;
    console.log(user);

  });
  
  
  req.flash('success', 'You are now registered and can login');
  res.location('/');
  res.redirect('/');

});

// route /users/login
// Renders the login page, login.jade 
router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: 'Invalid username or password'
  }),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    req.flash('success', "You are now logged in!");
    res.location('/');
    res.redirect('/');
  });
module.exports = router;
