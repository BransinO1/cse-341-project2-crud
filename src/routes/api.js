const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const apiController = require('../controllers/apiController');

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: APIs for managing items
 */

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Item created successfully
 *   get:
 *     summary: Retrieve all items
 *     tags: [Items]
 *     responses:
 *       '200':
 *         description: A list of items
 */

// Create item
router.post(
  '/items',
  [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('description').not().isEmpty().withMessage('Description is required'),
    check('price').isNumeric().withMessage('Price must be a number')
  ],
  apiController.createItem
);

// Retrieve all items
router.get('/items', apiController.getAllItems);

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Retrieve an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Item retrieved successfully
 *   put:
 *     summary: Update an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Item updated successfully
 *   delete:
 *     summary: Delete an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Item deleted successfully
 */

// Retrieve item by ID, update item by ID, and delete item by ID routes
router.get('/items/:id', apiController.getItemById);
router.put('/items/:id', apiController.updateItem);
router.delete('/items/:id', apiController.deleteItem);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: APIs for managing users
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: number
 *               dateOfBirth:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User created successfully
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: A list of users
 */

// Create user and retrieve all users routes
router.post(
  '/users',
  [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Email is invalid'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('address').not().isEmpty().withMessage('Address is required'),
    check('phone').isNumeric().withMessage('Phone must be a number'),
    check('dateOfBirth').not().isEmpty().withMessage('Date of Birth is required')
  ],
  apiController.createUser
);

// Retrieve user by ID, update user by ID, and delete user by ID routes
router.get('/users/:id', apiController.getUserById);
router.put('/users/:id', apiController.updateUser);
router.delete('/users/:id', apiController.deleteUser);

module.exports = router;
