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
        .toLowerCase()
        .isIn(['asc', 'desc']).withMessage(messages.INVALID_ORDER),

];

// Define routes
// GET /subtasks/:id
/**
 * @swagger
 * /subtasks/{id}:
 *   get:
 *     summary: Retrieve a specific subtask
 *     tags:
 *       - Subtasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subtask
 *     responses:
 *       200:
 *         description: Subtask retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subtask:
 *                   type: object
 *       404:
 *         description: Subtask not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware.jwtAuth, validateSubtask, subtaskController.getSubtask);

// GET /subtasks
/**
 * @swagger
 * /subtasks:
 *   get:
 *     summary: Retrieve subtasks with optional filters
 *     tags:
 *       - Subtasks
 *     parameters:
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
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
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware.jwtAuth, validateSubtask, subtaskController.getSubtasks);

// POST /subtasks
/**
 * @swagger
 * /subtasks:
 *   post:
 *     summary: Create a new subtask
 *     tags:
 *       - Subtasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - parentTask
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the subtask
 *               description:
 *                 type: string
 *                 description: Description of the subtask
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 description: Priority of the subtask
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 description: Status of the subtask
 *               due:
 *                 type: string
 *                 format: date
 *                 description: Due date for the subtask
 *               parentTask:
 *                 type: string
 *                 description: ID of the parent task
 *     responses:
 *       201:
 *         description: Subtask created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 subtask:
 *                   type: object
 *       422:
 *         description: Validation error or parent task not found
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware.jwtAuth, validateSubtask, subtaskController.createSubtask);

// PUT /subtasks/:id
/**
 * @swagger
 * /subtasks/{id}:
 *   put:
 *     summary: Update an existing subtask
 *     tags:
 *       - Subtasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subtask
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - parentTask
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the subtask
 *               description:
 *                 type: string
 *                 description: Updated description of the subtask
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 description: Updated priority
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 description: Updated status
 *               due:
 *                 type: string
 *                 format: date
 *                 description: Updated due date
 *               parentTask:
 *                 type: string
 *                 description: Updated parent task ID
 *     responses:
 *       200:
 *         description: Subtask updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 subtask:
 *                   type: object
 *       404:
 *         description: Subtask or parent task not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware.jwtAuth, validateSubtask, subtaskController.updateSubtask);

// DELETE /subtasks/:id
/**
 * @swagger
 * /subtasks/{id}:
 *   delete:
 *     summary: Delete a specific subtask
 *     tags:
 *       - Subtasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subtask
 *     responses:
 *       200:
 *         description: Subtask deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Subtask not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware.jwtAuth, validateSubtask, subtaskController.deleteSubtask);

module.exports = router;