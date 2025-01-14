const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');

const categoryController = require('../controllers/category');
const authMiddleware = require('../middleware/jwtAuth');
const { messages, status, priorities } = require('../util/constants');

const Category = require('../models/category');

const getFieldNames = (model) => {
    return Object.keys(model.schema.paths);
};

const fields = getFieldNames(Category)

// Define validation
const validateCategory = [
    body('name')
        .notEmpty().withMessage(messages.NAME_REQUIRED)
        .isString().withMessage(messages.CATEGORY_TYPE)
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage(messages.CATGEORY_LENGTH),
    query('status')
        .trim()
        .optional()
        .isIn(status).withMessage(messages.INVALID_STATUS),
    query('search')
        .optional()
        .trim()
        .isString().withMessage(messages.INVALID_SEARCH),
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage(messages.INVALID_PAGE),
    query('limit')
        .optional()
        .isInt({ min: 1 }).withMessage(messages.INVALID_LIMIT),
    query('priority')
        .optional()
        .trim()
        .isIn(priorities).withMessage(messages.TASK_PRIORITY_TYPE),
    query('sortBy')
        .optional()
        .trim()
        .isIn(fields).withMessage(messages.INVALID_SORT_BY),
    query('order')
        .optional()
        .trim()
        .toLowerCase()
        .isIn(['asc', 'desc']).withMessage(messages.INVALID_ORDER),
];

// Define routes
// GET /categories/:id/tasks
/**
 * @swagger
 * /categories/{id}/tasks:
 *   get:
 *     summary: Retrieve tasks associated with a specific category
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filter tasks by priority
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter tasks by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search tasks by title or description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of tasks per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort tasks by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *       204:
 *         description: No tasks found
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get('/:id/tasks', authMiddleware.jwtAuth, categoryController.getTasksByCategory);

// GET /categories/:id
/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Retrieve a specific category
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: object
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware.jwtAuth, categoryController.getCategory);

// GET /categories
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve categories with optional filters
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search categories by name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of categories per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort categories by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *       204:
 *         description: No categories found
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware.jwtAuth, categoryController.getCategories);

// POST /categories
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the category
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   type: object
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware.jwtAuth, validateCategory, categoryController.createCategory);

// PUT /categories/:id
/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the category
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   type: object
 *       404:
 *         description: Category not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware.jwtAuth, validateCategory, categoryController.updateCategory);

// DELETE /categories/:id
/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a specific category
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware.jwtAuth, categoryController.deleteCategory);


module.exports = router;