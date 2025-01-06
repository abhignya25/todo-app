const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const subtaskController = require('../controllers/subtask');
const authMiddleware = require('../middleware/jwtAuth');

const validateSubtask = [
    body('title')
        .isString().withMessage('Subtask title must be a string')
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('Subtask title must be between 3 and 100 characters long')
        .matches(/^[a-zA-Z0-9 ]+$/).withMessage('Subtask title can only contain alphanumeric characters and spaces')
        .trim(),
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
// GET /subtask
router.get('/:id', authMiddleware.jwtAuth, validateSubtask, subtaskController.getSubtask);

// GET /subtasks
router.get('/', authMiddleware.jwtAuth, validateSubtask, subtaskController.getSubtasks);

// POST /subtasks
router.post('/', authMiddleware.jwtAuth, validateSubtask, subtaskController.createSubtask);

// PUT /subtasks/:id
router.put('/:id', authMiddleware.jwtAuth, validateSubtask, subtaskController.updateSubtask);

// DELETE /subtasks/:id
router.delete('/:id', authMiddleware.jwtAuth, validateSubtask, subtaskController.deleteSubtask);

module.exports = router;