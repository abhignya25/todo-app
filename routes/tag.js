const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');

const tagController = require('../controllers/tag');
const authMiddleware = require('../middleware/jwtAuth');
const { messages } = require('../util/constants');

const Tag = require('../models/tag');

const getFieldNames = (model) => {
    return Object.keys(model.schema.paths);
};

const fields = getFieldNames(Tag)

const validateTag = [
    body('name')
        .notEmpty().withMessage(messages.NAME_REQUIRED)
        .trim()
        .isString().withMessage(messages.TAG_TYPE)
        .isLength({ min: 3, max: 20 }).withMessage(messages.TAG_LENGTH),
    query('search')
        .trim()
        .optional()
        .isString().withMessage(messages.INVALID_SEARCH),
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage(messages.INVALID_PAGE),
    query('limit')
        .optional()
        .isInt({ min: 1 }).withMessage(messages.INVALID_LIMIT),
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
// GET /tags/:id
/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     summary: Retrieve a specific tag
 *     tags:
 *       - Tags
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tag
 *     responses:
 *       200:
 *         description: Tag retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tag:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     userId:
 *                       type: string
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware.jwtAuth, tagController.getTag);

// GET /tags
/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Retrieve all tags with optional filters
 *     tags:
 *       - Tags
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search tags by name
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
 *         description: Number of tags per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort tags by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: Tags retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       userId:
 *                         type: string
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware.jwtAuth, tagController.getTags);

// POST /tags
/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Create a new tag
 *     tags:
 *       - Tags
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
 *                 description: Name of the tag
 *     responses:
 *       201:
 *         description: Tag created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tag:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     userId:
 *                       type: string
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware.jwtAuth, validateTag, tagController.createTag);

// PUT /tags/:id
/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     summary: Update an existing tag
 *     tags:
 *       - Tags
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tag
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
 *                 description: Updated name of the tag
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tag:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     userId:
 *                       type: string
 *       404:
 *         description: Tag not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware.jwtAuth, validateTag, tagController.updateTag);

// DELETE /tags/:id
/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Delete a specific tag
 *     tags:
 *       - Tags
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tag
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware.jwtAuth, tagController.deleteTag);

module.exports = router;