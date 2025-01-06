// Import modules
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import controller
const taskController = require('../controllers/task');
const authMiddleware = require('../middleware/jwtAuth');

const validateTask = [
    body('title')
        .isString().withMessage('Subtask title must be a string')
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('Subtask title must be between 3 and 100 characters long'),
    body('description')
        .optional()
        .trim()
        .isString().withMessage('Subtask description must be a string')
        .isLength({ max: 500 }).withMessage('Subtask description must be at most 500 characters long'),
    body('due')
        .optional()
        .trim()
        .isISO8601().withMessage('Due date must be a valid date')
        .toDate(),
    body('status')
        .optional()
        .trim()
        .isIn(["Open", "In Progress", "Completed"]).withMessage('Status must be one of "Open", "In Progress", "Completed"'),
    body('priority')
        .optional()
        .trim()
        .isIn(["High", "Medium", "Low"]).withMessage('Priority must be one of "High", "Medium", "Low"'),
];

// Define routes
// GET /tasks/:id/subtasks
router.get('/:id/subtasks', authMiddleware.jwtAuth, taskController.getSubtasksByTask);

// GET /tasks/:id
router.get('/:id', authMiddleware.jwtAuth, taskController.getTask);

// GET /tasks
router.get('/', authMiddleware.jwtAuth, taskController.getTasks);

// POST /tasks
router.post('/', authMiddleware.jwtAuth, validateTask, taskController.createTask);

// PUT /tasks/:id
router.put('/:id', authMiddleware.jwtAuth, validateTask, taskController.updateTask);

// DELETE /tasks/:id
router.delete('/:id', authMiddleware.jwtAuth, taskController.deleteTask);

module.exports = router;