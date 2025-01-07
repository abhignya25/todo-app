const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const categoryController = require('../controllers/category');
const authMiddleware = require('../middleware/jwtAuth');
const { messages } = require('../util/messages');

// Define validation
const validateCategory = [
    body('name')
        .isString().withMessage(messages.CATEGORY_TYPE)
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage(messages.CATGEORY_LENGTH)
];

// Define routes
// GET /categories/:id/tasks
router.get('/:id/tasks', authMiddleware.jwtAuth, categoryController.getTasksByCategory);

// GET /categories/:id
router.get('/:id', authMiddleware.jwtAuth, categoryController.getCategory);

// GET /categoriess
router.get('/', authMiddleware.jwtAuth, categoryController.getCategories);

// POST /categories
router.post('/', authMiddleware.jwtAuth, validateCategory, categoryController.createCategory);

// PUT /categories/:id
router.put('/:id', authMiddleware.jwtAuth, validateCategory, categoryController.updateCategory);

// DELETE /categories/:id
router.delete('/:id', authMiddleware.jwtAuth, categoryController.deleteCategory);


module.exports = router;