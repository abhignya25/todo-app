const { validationResult } = require('express-validator');

const Task = require("../models/task");
const Category = require("../models/category");
const Tag = require("../models/tag");
const Subtask = require("../models/subtask");
const { messages, codes } = require('../util/constants');

exports.createTask = async (req, res, next) => {
    let files = [];

    if (req.files && req.files.length > 0) {
        files = req.files.map(file => ({
            filename: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size
        }));
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error(messages.VALIDATION_FAILED);
        error.statusCode = 422;
        error.errors = errors.array();
        error.code = codes.VALIDATION_ERROR;
        return next(error);
    }

    try {
        // Check if category exists
        if (req.body.category) {
            const category = await Category.findById(req.body.category);
            if (!category) {
                const error = new Error(messages.CATEGORY_NOT_FOUND);
                error.statusCode = 422;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }
        }

        const tags = await Tag.find({ '_id': { $in: req.body.tags || [] } });
        if (tags.length !== (req.body.tags || []).length) {
            const error = new Error(messages.TAGS_NOT_FOUND);
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

    const taskData = {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        tags: req.body.tags,
        category: req.body.category,
        files: files,
        userId: req.user.id
    }

    if (req.body.due) {
        taskData.due = new Date(req.body.due);
    }

    const task = new Task(taskData);

    task.save()
        .then(task => {
            res.status(201).json({
                message: messages.TASK_CREATED,
                task: task
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

exports.getTask = (req, res, next) => {
    Task.findOne({ _id: req.params.id, userId: req.user.id })
        .then(task => {
            if (!task) {
                const error = new Error(messages.TASK_NOT_FOUND);
                error.statusCode = 404;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }

            res.status(200).json({
                task: task
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

exports.getTasks = (req, res, next) => {
    const { priority = '', status = '', search = '', page = 1, limit = 10, sortBy = '', order = '' } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const offset = (pageNumber - 1) * limitNumber;

    const searchQuery = {
        userId: req.user.id,
        ...(search && {
            $or: [
                { title: { $regex: `.*${search}.*`, $options: 'i' } },
                { description: { $regex: `.*${search}.*`, $options: 'i' } }
            ]
        }),
        ...(status && { status: status }),
        ...(priority && { priority: priority })
    }

    const sortQuery = {};
    if (sortBy) {
        sortQuery[sortBy] = order ? (order.toLowerCase() === 'asc' ? 1 : -1) : -1;
    }

    Task.find(searchQuery).skip(offset).limit(limitNumber).sort(sortQuery)
        .then(tasks => {
            if (tasks.length === 0) {
                return res.status(204).json({
                    tasks: []
                });
            }

            res.status(200).json({
                tasks: tasks
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

exports.updateTask = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error(messages.VALIDATION_FAILED);
        error.statusCode = 422;
        error.errors = errors.array();
        error.code = codes.VALIDATION_ERROR;
        return next(error);
    }

    try {
        // Check if category exists
        if (req.body.category) {
            const category = await Category.findById(req.body.category);
            if (!category) {
                const error = new Error(messages.CATEGORY_NOT_FOUND);
                error.statusCode = 422;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }
        }

        // Check if all tags exist
        const tags = await Tag.find({ '_id': { $in: req.body.tags || [] } });
        if (tags.length !== (req.body.tags || []).length) {
            const error = new Error(messages.TAGS_NOT_FOUND);
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

    const taskData = {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        tags: req.body.tags,
        category: req.body.category,
        userId: req.user.id
    }

    if (req.body.due) {
        taskData.due = new Date(req.body.due);
    }

    Task.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, {
        $set: taskData
    }, { new: true })
        .then(task => {
            if (!task) {
                const error = new Error(messages.TASK_NOT_FOUND);
                error.statusCode = 404;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }

            res.status(200).json({
                message: messages.TASK_UPDATED,
                task: task
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

exports.deleteTask = (req, res, next) => {
    Task.findOneAndRemove({ _id: req.params.id, userId: req.user.id })
        .then(task => {
            if (!task) {
                const error = new Error(messages.TASK_NOT_FOUND);
                error.statusCode = 404;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }

            res.status(200).json({
                message: messages.TASK_DELETED
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

exports.uploadFiles = async (req, res, next) => {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
        const error = new Error(messages.TASK_NOT_FOUND)
        error.statusCode = 404
        error.code = codes.RESOURCE_DOES_NOT_EXIST
        return next(error)
    }

    if (!req.files || req.files.length === 0) {
        const error = new Error(messages.NO_FILES_UPLOADED)
        error.statusCode = 422
        error.code = codes.VALIDATION_ERROR
        return next(error)
    }

    const files = req.files.map(file => ({
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
    }));

    task.files = files;

    task.save()
        .then((task => {
            return res.status(200).json({
                message: messages.FILE_UPLOAD_SUCCESSFUL,
                task: task
            });
        }))
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

exports.getSubtasksByTask = (req, res, next) => {
    const { priority = '', search = '', status = '', page = 1, limit = 10, sortBy = '', order = '' } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const offset = (pageNumber - 1) * limitNumber;

    Task.findOne({ _id: req.params.id, userId: req.user.id })
        .then((task) => {
            if (!task) {
                const error = new Error(messages.TASK_NOT_FOUND);
                error.statusCode = 404;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }

            const searchQuery = {
                parentTask: task._id,
                ...(search && {
                    $or: [
                        { title: { $regex: `.*${search}.*`, $options: 'i' } },
                        { description: { $regex: `.*${search}.*`, $options: 'i' } }
                    ]
                }),
                ...(status && { status: status }),
                ...(priority && { priority: priority })
            }

            const sortQuery = {}
            if (sortBy) {
                sortQuery[sortBy] = order ? (order.toLowerCase() === 'asc' ? 1 : -1) : -1
            }

            Subtask.find(searchQuery).skip(offset).limit(limitNumber).sort(sortQuery)
                .then(subtasks => {
                    if (subtasks.length === 0) {
                        return res.status(204).json({
                            subtasks: []
                        });
                    }

                    // Return the tasks in the response
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
        })
}