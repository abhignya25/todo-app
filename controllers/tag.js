const Tag = require('../models/tag');
const user = require('../models/user');
const { validationResult } = require('express-validator');
const { messages, codes } = require('../util/constants');


exports.createTag = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error(messages.VALIDATION_FAILED);
        error.statusCode = 422;
        error.errors = errors.array();
        error.code = codes.VALIDATION_ERROR;
        return next(error);
    }

    const tag = new Tag({
        name: req.body.name,
        userId: req.user.id
    });

    tag.save()
        .then(tag => {
            res.status(201).json({
                message: messages.TAG_CREATED_SUCCESSFULLY,
                tag: tag
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

exports.getTag = (req, res, next) => {
    Tag.findOne({_id: req.params.id, userId: req.user.id})
        .then(tag => {
            if (!tag) {
                const error = new Error(messages.TAG_NOT_FOUND);
                error.statusCode = 404;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }

            res.status(200).json({
                tag: tag
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

exports.getTags = (req, res, next) => {
    const { search = '', page = 1, limit = 10, sortBy = '', order = '' } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const offset = (pageNumber - 1) * limitNumber;

    const searchQuery = {
        userId: req.user.id,
        ...(search && {
            name: { $regex: `.*${search}.*`, $options: 'i' }
        }),
    }

    const sortQuery = {}
    if (sortBy) {
        sortQuery[sortBy] = order ? (order.toLowerCase() === 'asc' ? 1 : -1) : -1
    }

    Tag.find(searchQuery).skip(offset).limit(limitNumber).sort(sortQuery)
        .then(tags => {
            res.status(200).json({
                tags: tags
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

exports.updateTag = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error(messages.VALIDATION_FAILED);
        error.statusCode = 422;
        error.errors = errors.array();
        error.code = codes.VALIDATION_ERROR;
        return next(error);
    }
    
    Tag.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, {$set: {
        name: req.body.name,
        userId: req.user.id
    }}, { new: true })
        .then(tag => {
            if (!tag) {
                const error = new Error(messages.TAG_NOT_FOUND);
                error.statusCode = 404;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }
            res.status(200).json({
                message: messages.TAG_UPDATED,
                tag: tag
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

exports.deleteTag = (req, res, next) => {
    Tag.findOneAndRemove({ _id: req.params.id, userId: req.user.id })
        .then(tag => {
            if (!tag) {
                const error = new Error(messages.TAG_NOT_FOUND);
                error.statusCode = 404;
                error.code = codes.RESOURCE_DOES_NOT_EXIST;
                return next(error);
            }

            res.status(200).json({
                message: messages.TAG_DELETED
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