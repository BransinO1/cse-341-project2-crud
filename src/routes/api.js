const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const apiController = require('../controllers/apiController');
const Item = require('../models/item');
const User = require('../models/user')

// Items Updates

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
 *               productName:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Item created successfully
 *       '400':
 *         description: Bad request, validation error
 *       '500':
 *         description: Internal server error
 */
router.post(
  '/items',
  [
    check('productName').not().isEmpty().withMessage('Product Name is required'),
    check('description').not().isEmpty().withMessage('Description is required'),
    check('price').isNumeric().withMessage('Price must be a number'),
    check('stock').isNumeric().withMessage('Stock must be a number'),
    check('category').not().isEmpty().withMessage('Category is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newItem = new Item({
        productName: req.body.productName,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        category: req.body.category
      });

      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Retrieve all items
 *     tags: [Items]
 *     responses:
 *       '200':
 *         description: A list of items
 *       '500':
 *         description: Internal server error
 */
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

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
 *         description: ID of the item to retrieve
 *     responses:
 *       '200':
 *         description: Item found
 *       '404':
 *         description: Item not found
 *       '500':
 *         description: Internal server error
 */

router.get('/items/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Item updated successfully
 *       '400':
 *         description: Bad request, validation error
 *       '404':
 *         description: Item not found
 *       '500':
 *         description: Internal server error
 */
router.put(
  '/items/:id',
  [
    check('productName').optional().not().isEmpty().withMessage('Product Name cannot be empty'),
    check('description').optional().not().isEmpty().withMessage('Description cannot be empty'),
    check('price').optional().isNumeric().withMessage('Price must be a number'),
    check('stock').optional().isNumeric().withMessage('Stock must be a number'),
    check('category').optional().not().isEmpty().withMessage('Category cannot be empty')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let item = await Item.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ msg: 'Item not found' });
      }

      item.productName = req.body.productName || item.productName;
      item.description = req.body.description || item.description;
      item.price = req.body.price || item.price;
      item.stock = req.body.stock || item.stock;
      item.category = req.body.category || item.category;

      const updatedItem = await item.save();
      res.json(updatedItem);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to delete
 *     responses:
 *       '200':
 *         description: Item deleted successfully
 *       '404':
 *         description: Item not found
 *       '500':
 *         description: Internal server error
 */
router.delete('/items/:id', async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    await item.remove();
    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Users Updates

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
 *               googleId:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *     responses:
 *       '200':
 *         description: User created successfully
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post(
  '/users',
  [
    check('googleId').not().isEmpty().withMessage('Google Id is required'),
    check('firstName').not().isEmpty().withMessage('First name is required'),
    check('lastName').not().isEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Email is invalid'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('dateOfBirth').isISO8601().withMessage('Date of Birth must be a valid date'),
    check('address.street').not().isEmpty().withMessage('Street is required'),
    check('address.city').not().isEmpty().withMessage('City is required'),
    check('address.state').not().isEmpty().withMessage('State is required'),
    check('address.zipCode').not().isEmpty().withMessage('Zip Code is required')
  ],
  apiController.createUser
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: A list of users
 *       '500':
 *         description: Internal server error
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       '200':
 *         description: User found
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               googleId:
 *                 type: string
 *                 example: 114534031755826059519
 *               firstName:
 *                 type: string
 *                 example: Corb
 *               lastName:
 *                 type: string
 *                 example: Meac
 *               email:
 *                 type: string
 *                 example: Corb.meac@example.com
 *               password:
 *                 type: string
 *                 example: cmpassword
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 1995-11-21
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: 456 East St
 *                   city:
 *                     type: string
 *                     example: Boise
 *                   state:
 *                     type: string
 *                     example: Idaho
 *                   zipCode:
 *                     type: string
 *                     example: 12345
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

router.put(
  '/users/:id',
  [
    check('googleId').not().isEmpty().withMessage('Google Id is required'),
    check('firstName').not().isEmpty().withMessage('First name is required'),
    check('lastName').not().isEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Email is invalid'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('dateOfBirth').isISO8601().withMessage('Date of Birth must be a valid date'),
    check('address.street').not().isEmpty().withMessage('Street is required'),
    check('address.city').not().isEmpty().withMessage('City is required'),
    check('address.state').not().isEmpty().withMessage('State is required'),
    check('address.zipCode').not().isEmpty().withMessage('Zip Code is required')
  ],
  apiController.updateUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.delete('/users/:id', apiController.deleteUser);

module.exports = router;
