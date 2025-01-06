const Task = require("../models/task");
const Subtask = require("../models/subtask");

exports.createTask = (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        due: new Date(req.body.due),
        status: req.body.status,
        tags: req.body.tags,
        category: req.body.category,
        userId: req.user.id
    });

    task.save()
        .then(task => {
            res.status(201).json({
                message: 'Task created successfully',
                task: task
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error creating task',
                error: err
            });
        });
}

exports.getTask = (req, res) => {
    Task.findOne({_id: req.params.id, userId: req.user.id})
        .then(task => {
            if (!task) {
                return res.status(404).json({
                    message: 'Task not found'
                });
            }

            res.status(200).json({
                task: task
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error getting task',
                error: err
            });
        });
}

exports.getTasks = (req, res) => {
    Task.find({ userId: req.user.id })
        .then(tasks => {
            res.status(200).json({
                tasks: tasks
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error getting tasks',
                error: err
            });
        });
}

exports.updateTask = (req, res) => {
    Task.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, {$set: {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        due: new Date(req.body.due),
        status: req.body.status,
        tags: req.body.tags,
        category: req.body.category,
        userId: req.user.id
    }}, {new: true})
        .then(task => {
            if (!task) {
                return res.status(404).json({
                    message: 'Task not found'
                });
            }

            res.status(200).json({
                message: 'Task updated successfully',
                task: task
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error updating task',
                error: err
            });
        });
}

exports.deleteTask = (req, res) => {
    Task.findOneAndRemove({ _id: req.params.id, userId: req.user.id })
        .then(task => {
            if (!task) {
                return res.status(404).json({
                    message: 'Task not found'
                });
            }

            res.status(200).json({
                message: 'Task deleted successfully'
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error deleting task',
                error: err
            });
        });
}

exports.getSubtasksByTask = (req, res) => {
    Task.findOne({_id: req.params.id, userId: req.user.id})
        .then((task) => {
            if(!task) {
                return res.status(404).json({
                    message: 'Task not found'
                });
            }

            Subtask.find({ parentTask: task._id })
                .then(subtasks => {
                    if (subtasks.length === 0) {
                        return res.status(404).json({
                            message: 'No subtasks found for this task'
                        });
                    }
                    
                    // Return the tasks in the response
                    res.status(200).json({
                        subtasks: subtasks
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'Error getting subtasks',
                        error: err
                    });
                });
        })
}