const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');

const subtaskController = require('../controllers/subtask');
const authMiddleware = require('../middleware/jwtAuth');
const { messages, status, priorities } = require('../util/constants');

const Subtask = require('../models/subtask');

const getFieldNames = (model) => {
    return Object.keys(model.schema.paths);
};

const fields = getFieldNames(Subtask)

const validateSubtask = [
    body('title')
        .notEmpty().withMessage(messages.TITLE_REQUIRED)
        .isString().withMessage(messages.SUBTASK_TITLE_TYPE)
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage(messages.SUBTASK_TITLE_LENGTH),
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
    body('parentTask')
        .notEmpty().withMessage(messages.PARENT_TASK_REQUIRED),
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
        .isIn(['asc', 'desc']).withMessage(messages.INVALID_ORDER),

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