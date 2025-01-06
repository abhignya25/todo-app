const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category');
const authMiddleware = require('../middleware/jwtAuth');

// Define routes
// GET /categories/:id/tasks
router.get('/:id/tasks', authMiddleware.jwtAuth, categoryController.getTasksByCategory);

// GET /categories/:id
router.get('/:id', authMiddleware.jwtAuth, categoryController.getCategory);

// GET /categoriess
router.get('/', authMiddleware.jwtAuth, categoryController.getCategories);

// POST /categories
router.post('/', authMiddleware.jwtAuth, categoryController.createCategory);

// PUT /categories/:id
router.put('/:id', authMiddleware.jwtAuth, categoryController.updateCategory);

// DELETE /categories/:id
router.delete('/:id', authMiddleware.jwtAuth, categoryController.deleteCategory);


module.exports = router;