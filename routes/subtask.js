const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const subtaskController = require('../controllers/subtask');
const authMiddleware = require('../middleware/jwtAuth');
const { messages, status, priorities } = require('../util/messages');

const validateSubtask = [
    body('title')
        .isString().withMessage(messages.SUBTASK_TITLE_TYPE)
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage(messages.SUBTASK_TITLE_LENGTH)
        .trim(),
    body('description')
        .optional()
        .trim()
        .isString().withMessage(messages.SUBTASK_DESCRIPTION_TYPE)
        .isLength({ max: 500 }).withMessage(messages.SUBTASK_DESCRIPTION_LENGTH),
    body('due')
        .optional()
        .trim()
        .isISO8601().withMessage(messages.SUBTASK_DUE_TYPE)
        .toDate(),
    body('status')
        .optional()
        .trim()
        .isIn(status).withMessage(messages.SUBTASK_PRIORITY_TYPE),
    body('priority')
        .optional()
        .trim()
        .isIn(priorities).withMessage(messages.SUBTASK_STATUS_TYPE),
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