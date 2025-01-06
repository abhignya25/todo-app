const Subtask = require('../models/subtask');

exports.createSubtask = (req, res) => {
    const subtask = new Subtask({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        due: new Date(req.body.due),
        status: req.body.status,
        parentTask: req.body.parentTask,
        userId: req.user.id
    });

    subtask.save()
        .then(subtask => {
            res.status(201).json({
                message: 'Subtask created successfully',
                subtask: subtask
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error creating subtask',
                error: err
            });
        });
}

exports.getSubtask = (req, res) => {
    Subtask.findOne({ _id: req.params.id, userId: req.user.id })
        .then(subtask => {
            if (!subtask) {
                return res.status(404).json({
                    message: 'Subtask not found'
                });
            }

            res.status(200).json({
                subtask: subtask
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error getting subtask',
                error: err
            });
        });
}

exports.getSubtasks = (req, res) => {
    Subtask.find({ userId: req.user.id })
        .then(subtasks => {
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
}

exports.updateSubtask = (req, res) => {
    Subtask.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, {
        $set: {
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            due: new Date(req.body.due),
            status: req.body.status,
            parentTask: req.body.parentTask,
            userId: req.user.id
        }
    }, {new: true})
        .then(subtask => {
            if(!subtask) {
                return res.status(404).json({
                    message: 'Subtask not found'
                });
            }

            res.status(200).json({
                message: 'Subtask updated successfully',
                subtask: subtask
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error updating subtask',
                error: err
            });
        });
}

exports.deleteSubtask = (req, res) => {
    Subtask.findOneAndRemove({ _id: req.params.id, userId: req.user._id })
        .then(subtask => {
            if (!subtask) {
                return res.status(404).json({
                    message: 'Subtask not found'
                });
            }

            res.status(200).json({
                message: 'Subtask deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error deleting subtask',
                error: err
            });
        });
}