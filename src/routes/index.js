const router = require('express').Router();

// Import other route modules
const swaggerRoute = require('./swagger');
const usersRoute = require('./users');
const itemsRoute = require('./items');

// Route for Swagger documentation
router.use('/swagger', swaggerRoute);

// Index route
router.get('/', (req, res) => {
    res.send('Welcome to the API landing page!');
});

// Users route
router.use('/users', usersRoute);

// Items route
router.use('/items', itemsRoute);

module.exports = router;
