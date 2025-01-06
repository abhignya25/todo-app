const Tag = require('../models/tag');
const user = require('../models/user');
const { validationResult } = require('express-validator');

exports.createTag = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Validation failed.', errors: errors.array() });
    }

    const tag = new Tag({
        name: req.body.name,
        userId: req.user.id
    });

    tag.save()
        .then(tag => {
            res.status(201).json({
                message: 'Tag created successfully',
                tag: tag
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error creating tag',
                error: err
            });
        });
}

exports.getTag = (req, res) => {
    Tag.findOne({_id: req.params.id, userId: req.user.id})
        .then(tag => {
            if (!tag) {
                return res.status(404).json({
                    message: 'Tag not found'
                });
            }

            res.status(200).json({
                tag: tag
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error getting tag',
                error: err
            });
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
            res.status(500).json({
                message: 'Error getting tags',
                error: err
            });
        });
}

exports.updateTag = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Validation failed.', errors: errors.array() });
    }
    
    Tag.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, {$set: {
        name: req.body.name,
        userId: req.user.id
    }}, { new: true })
        .then(tag => {
            if (!tag) {
                return res.status(404).json({
                    message: 'Tag not found'
                });
            }
            res.status(200).json({
                message: 'Tag updated',
                tag: tag
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error updating tag',
                error: err
            });
        });
}

exports.deleteTag = (req, res) => {
    Tag.findOneAndRemove({ _id: req.params.id, userId: req.user.id })
        .then(tag => {
            if (!tag) {
                return res.status(404).json({
                    message: 'Tag not found'
                });
            }

            res.status(200).json({
                message: 'Tag deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error deleting tag',
                error: err
            });
        });
}