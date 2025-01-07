const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const tagController = require('../controllers/tag');
const authMiddleware = require('../middleware/jwtAuth');
const { messages } = require('../util/constants');

const validateTag = [
    body('name')
        .isString().withMessage(messages.TAG_TYPE)
        .trim()
        .isLength({ min: 3, max: 20 }).withMessage(messages.TAG_LENGTH)
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