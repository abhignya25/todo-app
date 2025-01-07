const { validationResult } = require('express-validator');

const Subtask = require('../models/subtask');
const Task = require('../models/task');
const { messages, codes } = require('../util/constants');

exports.createSubtask = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error(messages.VALIDATION_FAILED);
        error.statusCode = 422;
        error.errors = errors.array();
        error.code = codes.VALIDATION_ERROR;
        return next(error);
    }

    try {
        const parentTask = await Task.findById(req.body.parentTask);
        if (!parentTask) {
            const error = new Error(messages.TASK_NOT_FOUND);
            error.statusCode = 422;
            error.code = codes.RESOURCE_DOES_NOT_EXIST;
            return next(error);
        }
    } catch (err) {
        const error = new Error();
        error.errors = [
            {
                code: err.code,
                msg: err.message
            }
        ];
        return next(error);
    }

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
                message: messages.SUBTASK_CREATED_SUCCESSFULLY,
                subtask: subtask
            });
        })
        .catch(err => {
            const error = new Error();
            error.errors = [
                {
                    code: err.code,
                    msg: err.message
                }
            ];
            return next(error);
        });
}

exports.getSubtask = (req, res, next) => {
    Subtask.findOne({ _id: req.params.id, userId: req.user.id })
        .then(subtask => {
            if (!subtask) {
                const error = new Error(messages.SUBTASK_NOT_FOUND);
                error.statusCode = 404;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }

            res.status(200).json({
                subtask: subtask
            });
        })
        .catch(err => {
            const error = new Error();
            error.errors = [
                {
                    code: err.code,
                    msg: err.message
                }
            ];
            return next(error);
        });
}

exports.getSubtasks = (req, res, next) => {
    Subtask.find({ userId: req.user.id })
        .then(subtasks => {
            res.status(200).json({
                subtasks: subtasks
            });
        })
        .catch(err => {
            const error = new Error();
            error.errors = [
                {
                    code: err.code,
                    msg: err.message
                }
            ];
            return next(error);
        });
}

exports.updateSubtask = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error(messages.VALIDATION_FAILED);
        error.statusCode = 422;
        error.errors = errors.array();
        error.code = codes.VALIDATION_ERROR;
        return next(error);
    }

    try {
        const parentTask = await Task.findById(req.body.parentTask);
        if (!parentTask) {
            const error = new Error(messages.TASK_NOT_FOUND);
            error.statusCode = 422;
            error.code = codes.RESOURCE_DOES_NOT_EXIST;
            return next(error);
        }
    } catch (err) {
        const error = new Error();
        error.errors = [
            {
                code: err.code,
                msg: err.message
            }
        ];
        return next(error);
    }

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
    }, { new: true })
        .then(subtask => {
            if (!subtask) {
                const error = new Error(messages.SUBTASK_NOT_FOUND);
                error.statusCode = 404;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }

            res.status(200).json({
                message: messages.SUBTASK_UPDATED,
                subtask: subtask
            });
        })
        .catch(err => {
            const error = new Error();
            error.errors = [
                {
                    code: err.code,
                    msg: err.message
                }
            ];
            return next(error);
        });
}

exports.deleteSubtask = (req, res, next) => {
    Subtask.findOneAndRemove({ _id: req.params.id, userId: req.user._id })
        .then(subtask => {
            if (!subtask) {
                const error = new Error(messages.SUBTASK_NOT_FOUND);
                error.statusCode = 404;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }

            res.status(200).json({
                message: messages.SUBTASK_DELETED
            });
        })
        .catch(err => {
            const error = new Error();
            error.errors = [
                {
                    code: err.code,
                    msg: err.message
                }
            ];
            return next(error);
        });
}