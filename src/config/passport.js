const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists in the database
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // Create a new user if not already exists
      user = await new User({
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        // Optionally, you can save additional fields like profile photo
        // image: profile.photos[0].value
      }).save();
    }

    done(null, user); // Pass the user object to serializeUser
  } catch (error) {
    console.error('Error in Google Strategy', error);
    done(error);
  }
}));

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id); // Store user ID in session
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user); // Retrieve user from database and attach to req.user
  });
});

module.exports = passport;
