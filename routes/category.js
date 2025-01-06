const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const categoryController = require('../controllers/category');
const authMiddleware = require('../middleware/jwtAuth');

// Define validation
const validateCategory = [
    body('name')
        .isString().withMessage('Category name must be a string')
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('Category name must be between 3 and 50 characters long')
        .matches(/^[a-zA-Z0-9 ]+$/).withMessage('Category name can only contain alphanumeric characters and spaces'),
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