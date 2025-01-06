// Import modules
const express = require('express');
const router = express.Router();

// Import controller
const tagController = require('../controllers/tag');
const authMiddleware = require('../middleware/jwtAuth');

// Define routes
// GET /tags/:id
router.get('/:id', authMiddleware.jwtAuth, tagController.getTag);

// GET /tags
router.get('/', authMiddleware.jwtAuth, tagController.getTags);

// POST /tags
router.post('/', authMiddleware.jwtAuth, tagController.createTag);

// PUT /tags/:id
router.put('/:id', authMiddleware.jwtAuth, tagController.updateTag);

// DELETE /tags/:id
router.delete('/:id', authMiddleware.jwtAuth, tagController.deleteTag);

module.exports = router;