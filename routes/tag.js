const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const tagController = require('../controllers/tag');
const authMiddleware = require('../middleware/jwtAuth');

const validateTag = [
    body('name')
        .isString().withMessage('Category name must be a string')
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('Category name must be between 3 and 50 characters long')
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