const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const apiController = require('../controllers/apiController');


// Create
router.post(
    '/items',
    [
      check('name').not().isEmpty().withMessage('Name is required'),
      check('description').not().isEmpty().withMessage('Description is required'),
      check('price').isNumeric().withMessage('Price must be a number'),
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
      check('price').optional().isNumeric().withMessage('Price must be a number'),
    ],
    apiController.updateItem
  );
  
  // Delete
  router.delete('/items/:id', apiController.deleteItem);
  
  module.exports = router;