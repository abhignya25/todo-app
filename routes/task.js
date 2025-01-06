// Import modules
const express = require('express');
const router = express.Router();

// Import controller
const taskController = require('../controllers/task');
const authMiddleware = require('../middleware/jwtAuth');

// Define routes
// GET /tasks/:id/subtasks
router.get('/:id/subtasks', authMiddleware.jwtAuth, taskController.getSubtasksByTask);

// GET /tasks/:id
router.get('/:id', authMiddleware.jwtAuth, taskController.getTask);

// GET /tasks
router.get('/', authMiddleware.jwtAuth, taskController.getTasks);

// POST /tasks
router.post('/', authMiddleware.jwtAuth, taskController.createTask);

// PUT /tasks/:id
router.put('/:id', authMiddleware.jwtAuth, taskController.updateTask);

// DELETE /tasks/:id
router.delete('/:id', authMiddleware.jwtAuth, taskController.deleteTask);

module.exports = router;