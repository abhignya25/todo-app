const { validationResult } = require('express-validator');

const Category = require('../models/category');
const Task = require('../models/task');
const { messages, codes } = require('../util/constants');

exports.createCategory = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error(messages.VALIDATION_FAILED);
        error.statusCode = 422;
        error.errors = errors.array();
        error.code = codes.VALIDATION_ERROR;
        return next(error);
    }

    const category = new Category({
        name: req.body.name,
        userId: req.user.id
    });

    category.save()
        .then(category => {
            res.status(201).json({
                message: messages.CATEGORY_CREATED_SUCCESSFULLY,
                category: category
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

exports.getCategory = (req, res, next) => {
    Category.findOne({ _id: req.params.id, userId: req.user.id })
        .then(category => {
            if (!category) {
                const error = new Error(messages.CATEGORY_NOT_FOUND);
                error.statusCode = 404;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }

            res.status(200).json({
                category: category
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

exports.getCategories = (req, res, next) => {
    Category.find({ userId: req.user.id })
        .then(categories => {
            if (categories.length === 0) {
                return res.status(204).json({
                    categories: []
                });
            }

            res.status(200).json({
                categories: categories
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

exports.updateCategory = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error(messages.VALIDATION_FAILED);
        error.statusCode = 422;
        error.errors = errors.array();
        error.code = codes.VALIDATION_ERROR;
        return next(error);
    }

    Category.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, {
        $set: {
            name: req.body.name,
        }
    }, { new: true })
        .then(category => {
            if (!category) {
                const error = new Error(messages.CATEGORY_NOT_FOUND);
                error.statusCode = 404;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }

            res.status(200).json({
                message: messages.CATEGORY_UPDATED,
                category: category
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

exports.deleteCategory = (req, res, next) => {
    Category.findOneAndRemove({ _id: req.params.id, userId: req.user.id })
        .then(category => {
            if (!category) {
                const error = new Error(messages.CATEGORY_NOT_FOUND);
                error.statusCode = 404;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }

            res.status(200).json({
                message: messages.CATEGORY_DELETED
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

exports.getTasksByCategory = (req, res, next) => {
    Category.findOne({ _id: req.params.id, userId: req.user.id })
        .then(category => {
            if (!category) {
                const error = new Error(messages.CATEGORY_NOT_FOUND);
                error.statusCode = 404;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }

            Task.find({ category: category._id })
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