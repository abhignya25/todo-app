const { validationResult } = require('express-validator');

const Category = require('../models/category');
const Task = require('../models/task');
const { messages, codes } = require('../util/constants');
const { parse } = require('dotenv');

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
    const { search = '', page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const offset = (pageNumber - 1) * limitNumber;

    const searchQuery = {
        userId: req.user.id,
        ...(search && {
            name: { $regex: search, $options: 'i' }
        }),
    }

    Category.find(searchQuery).skip(offset).limit(limitNumber)
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
    const { priority = '', status = '', search = '', page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const offset = (pageNumber - 1) * limitNumber;

    Category.findOne({ _id: req.params.id, userId: req.user.id })
        .then(category => {
            if (!category) {
                const error = new Error(messages.CATEGORY_NOT_FOUND);
                error.statusCode = 404;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }

            const searchQuery = {
                category: category._id,
                ...(search && {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
                }),
                ...(status && { status: status }),
                ...(priority && { priority: priority })
            }

            Task.find(searchQuery).skip(offset).limit(limitNumber)
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