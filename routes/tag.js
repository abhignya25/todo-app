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
        .isIn(['asc', 'desc']).withMessage(messages.INVALID_ORDER),
];

// Define routes
// GET /tags/:id
router.get('/:id', authMiddleware.jwtAuth, tagController.getTag);

// GET /tags
router.get('/', authMiddleware.jwtAuth, tagController.getTags);

// POST /tags
router.post('/', authMiddleware.jwtAuth, validateTag, tagController.createTag);

// PUT /tags/:id
router.put('/:id', authMiddleware.jwtAuth, validateTag, tagController.updateTag);

// DELETE /tags/:id
router.delete('/:id', authMiddleware.jwtAuth, tagController.deleteTag);

module.exports = router;