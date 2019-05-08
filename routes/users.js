var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
const { check, validationResult } = require('express-validator/check');
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
  check('usernamme', "username field is required").isLength({min: 5}),
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
  

  if (!errors.isEmpty()) {
    // return res.status(422).json({ errors: errors.array() });
    res.render('register', {errors: errors.array()});
  }

  if (req.file) {
    console.log("Uploading file...");
    console.log(req.file);
    var profileimage = req.file.filename;
  } else {
    console.log('No file uploaded.');
    var profileimage = 'noimage.jpg';
  }
  
});

// route /users/login
// Renders the login page, login.jade 
router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

module.exports = router;
