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
/**
 * @swagger
 * /tasks/{id}/subtasks:
 *   get:
 *     summary: Get subtasks for a specific task
 *     tags:
 *       - Subtasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the parent task
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter subtasks by priority
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search subtasks by title or description
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *         description: Filter subtasks by status
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
 *         description: Number of subtasks per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort subtasks by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: Subtasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subtasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       priority:
 *                         type: string
 *                       status:
 *                         type: string
 *                       parentTask:
 *                         type: string
 *       204:
 *         description: No subtasks found
 *       404:
 *         description: Parent task not found
 *       500:
 *         description: Server error
 */
router.get('/:id/subtasks', authMiddleware.jwtAuth, taskController.getSubtasksByTask);

// GET /tasks/:id
/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */

router.get('/:id', authMiddleware.jwtAuth, taskController.getTask);

// GET /tasks
 /**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get a list of tasks
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 *       204:
 *         description: No tasks found
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware.jwtAuth, taskController.getTasks);

// POST /tasks
// POST /tasks
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Finish project report"
 *               description:
 *                 type: string
 *                 example: "Complete the final report for the client project"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: "high"
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 example: "pending"
 *               category:
 *                 type: string
 *                 example: "Work"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["urgent", "client"]
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task created successfully"
 *                 task:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64b8c9f2e8f1e34abc123456"
 *                     title:
 *                       type: string
 *                       example: "Finish project report"
 *                     description:
 *                       type: string
 *                       example: "Complete the final report for the client project"
 *                     priority:
 *                       type: string
 *                       example: "high"
 *                     status:
 *                       type: string
 *                       example: "pending"
 *                     category:
 *                       type: string
 *                       example: "Work"
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["urgent", "client"]
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "title"
 *                       message:
 *                         type: string
 *                         example: "Title is required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/', authMiddleware.jwtAuth, validateTask, upload.array('files', 5), taskController.createTask);

// POST /tasks/:taskId/upload
/**
 * @swagger
 * /tasks/{taskId}/files:
 *   post:
 *     summary: Upload files for a task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *       404:
 *         description: Task not found
 *       422:
 *         description: No files uploaded
 *       500:
 *         description: Server error
 */

router.post('/:taskId/upload', authMiddleware.jwtAuth, upload.array('files', 5), taskController.uploadFiles);

// PUT /tasks/:id
/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               due:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

router.put('/:id', authMiddleware.jwtAuth, validateTask, taskController.updateTask);

// DELETE /tasks/:id
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware.jwtAuth, taskController.deleteTask);

module.exports = router;