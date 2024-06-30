require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('./config/passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const apiRoutes = require('./routes/api');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerDefinition');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Check if MONGODB_URL is defined
if (!process.env.MONGODB_URL) {
  throw new Error('MONGODB_URL environment variable is not defined');
}

// Express session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    ttl: 14 * 24 * 60 * 60
  })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api', apiRoutes);

// Serve Swagger UI at /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/'); // Redirect to the index route
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});



// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
