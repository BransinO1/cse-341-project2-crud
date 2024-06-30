const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { validationResult } = require('express-validator');

// Google OAuth authentication initiator
exports.googleAuth = passport.authenticate('google', { scope: ['profile'] });

// Google OAuth callback handler
exports.googleCallback = passport.authenticate('google', {
  successRedirect: '/profile',
  failureRedirect: '/login', // Redirect to login page if authentication fails
});

// User registration handler (example using local strategy)
exports.registerUser = async (req, res, next) => {
    // Extract validation errors, if any
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { name, email, password, address, phone, dateOfBirth } = req.body;
  
    try {
      // Check if the user already exists
      let user = await User.findOne({ email });
  
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      // Create a new user instance
      user = new User({
        name,
        email,
        password,
        address,
        phone,
        dateOfBirth,
      });
  
      // Encrypt password using bcrypt
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      // Save user to database
      await user.save();
  
      // Return a success message
      res.status(200).json({ msg: 'User registered successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

// User login handler (example using local strategy)
exports.loginUser = passport.authenticate('local', {
    successRedirect: '/dashboard', // Redirect to dashboard on successful login
    failureRedirect: '/login', // Redirect back to login page on failed login
    failureFlash: true // Enable flash messages for failed login attempts
  });
  
  // Example of local strategy setup in Passport.js
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) { return done(err); }
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  }));

// User logout handler
exports.logoutUser = (req, res) => {
  req.logout(); // Provided by Passport to clear session
  res.redirect('/'); // Redirect to home page or login page
};

// User profile handler
exports.userProfile = (req, res) => {
  // Assuming user data is stored in req.user after authentication
  res.json(req.user); // Return logged-in user's profile data
};
