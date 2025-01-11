// Import modules
const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');

// Import controller
const taskController = require('../controllers/task');
const authMiddleware = require('../middleware/jwtAuth');

const { messages, status, priorities } = require('../util/constants');

const upload = require('../middleware/fileUpload');

// Import model
const Task = require('../models/task');

const getFieldNames = (model) => {
    return Object.keys(model.schema.paths);
};

const fields = getFieldNames(Task)

const validateTask = [
    body('title')
        .notEmpty().withMessage(messages.TITLE_REQUIRED)
        .isString().withMessage(messages.TASK_TITLE_TYPE)
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage(messages.TASK_TITLE_LENGTH),
    body('description')
        .optional()
        .trim()
        .isString().withMessage(messages.TASK_DESCRIPTION_TYPE)
        .isLength({ max: 500 }).withMessage(messages.TASK_DESCRIPTION_LENGTH),
    body('due')
        .optional()
        .trim()
        .isISO8601().withMessage(messages.TASK_DUE_TYPE)
        .toDate(),
    body('status')
        .optional()
        .trim()
        .isIn(status).withMessage(messages.TASK_STATUS_TYPE),
    body('priority')
        .optional()
        .trim()
        .isIn(priorities).withMessage(messages.TASK_PRIORITY_TYPE),
    body('tags')
        .optional()
        .isArray().withMessage(messages.TAGS_NOT_ARRAY),
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
// GET /tasks/:id/subtasks
router.get('/:id/subtasks', authMiddleware.jwtAuth, taskController.getSubtasksByTask);

// GET /tasks/:id
router.get('/:id', authMiddleware.jwtAuth, taskController.getTask);

// GET /tasks
router.get('/', authMiddleware.jwtAuth, taskController.getTasks);

// POST /tasks
router.post('/', authMiddleware.jwtAuth, validateTask, upload.array('files', 5), taskController.createTask);

// POST /tasks/:taskId/upload
router.post('/:taskId/upload', authMiddleware.jwtAuth, upload.array('files', 5), taskController.uploadFiles);

// PUT /tasks/:id
router.put('/:id', authMiddleware.jwtAuth, validateTask, taskController.updateTask);

// DELETE /tasks/:id
router.delete('/:id', authMiddleware.jwtAuth, taskController.deleteTask);

module.exports = router;