const express = require('express');
const passport = require('../config/passport');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth
 *     tags: [Auth]
 *     responses:
 *       '302':
 *         description: Redirect to Google OAuth
 *
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       '200':
 *         description: Successful authentication
 *       '401':
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     responses:
 *       '302':
 *         description: Redirect to home page after logout
 */

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard'); // Redirect to the dashboard route after successful login
  }
);

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// Protect the dashboard route with ensureAuth middleware
router.use('/dashboard', ensureAuth, require('./dashboard'));

module.exports = router;
