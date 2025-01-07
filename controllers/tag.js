const Tag = require('../models/tag');
const user = require('../models/user');
const { validationResult } = require('express-validator');
const { messages, codes } = require('../util/constants');


exports.createTag = (req, res) => {
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

exports.getTag = (req, res) => {
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

exports.getTags = (req, res) => {
    Tag.find({ userId: req.user.id })
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

exports.updateTag = (req, res) => {
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

exports.deleteTag = (req, res) => {
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