const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Item Routes

// Create
router.post(
  '/items',
  [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('description').not().isEmpty().withMessage('Description is required'),
    check('price').isNumeric().withMessage('Price must be a number')
  ],
  apiController.createItem
);

// Retrieve all
router.get('/items', apiController.getAllItems);

// Retrieve by ID
router.get('/items/:id', apiController.getItemById);

// Update
router.put(
  '/items/:id',
  [
    check('name').optional().not().isEmpty().withMessage('Name cannot be empty'),
    check('description').optional().not().isEmpty().withMessage('Description cannot be empty'),
    check('price').optional().isNumeric().withMessage('Price must be a number')
  ],
  apiController.updateItem
);

// Delete
router.delete('/items/:id', apiController.deleteItem);

// User Routes

// Create
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

// Retrieve all
router.get('/users', apiController.getAllUsers);

// Retrieve by ID
router.get('/users/:id', apiController.getUserById);

// Update
router.put(
  '/users/:id',
  [
    check('name').optional().not().isEmpty().withMessage('Name cannot be empty'),
    check('email').optional().isEmail().withMessage('Email is invalid'),
    check('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('address').optional().not().isEmpty().withMessage('Address cannot be empty'),
    check('phone').optional().isNumeric().withMessage('Phone must be a number'),
    check('dateOfBirth').optional().not().isEmpty().withMessage('Date of Birth cannot be empty')
  ],
  apiController.updateUser
);

// Delete
router.delete('/users/:id', apiController.deleteUser);

module.exports = router;
