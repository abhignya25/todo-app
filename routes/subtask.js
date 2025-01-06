// Import modules
const express = require('express');
const router = express.Router();

// Import controller
const subtaskController = require('../controllers/subtask');
const authMiddleware = require('../middleware/jwtAuth');

// Define routes
// GET /subtask
router.get('/:id', authMiddleware.jwtAuth, subtaskController.getSubtask);

// GET /subtasks
router.get('/', authMiddleware.jwtAuth, subtaskController.getSubtasks);

// POST /subtasks
router.post('/', authMiddleware.jwtAuth, subtaskController.createSubtask);

// PUT /subtasks/:id
router.put('/:id', authMiddleware.jwtAuth, subtaskController.updateSubtask);

// DELETE /subtasks/:id
router.delete('/:id', authMiddleware.jwtAuth, subtaskController.deleteSubtask);

module.exports = router;