const { validationResult } = require('express-validator');

const Category = require('../models/categrory');
const Task = require('../models/task');
const user = require('../models/user');

exports.createCategory = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Validation failed.', errors: errors.array() });
    }

    const category = new Category({
        name: req.body.name,
        userId: req.user.id
    });

    category.save()
        .then(category => {
            res.status(201).json({
                message: 'Category created successfully',
                category: category
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error creating category',
                error: err
            });
        });
}

exports.getCategory = (req, res) => {
    Category.findOne({ _id: req.params.id, userId: req.user.id })
        .then(category => {
            if (!category) {
                return res.status(404).json({
                    message: 'Category not found'
                });
            }

            res.status(200).json({
                category: category
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error getting category',
                error: err
            });
        });
}

exports.getCategories = (req, res) => {
    Category.find({ userId: req.user.id })
        .then(categories => {
            res.status(200).json({
                categories: categories
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error getting categories',
                error: err
            });
        });
}

exports.updateCategory = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Validation failed.', errors: errors.array() });
    }
    
    Category.findOneAndUpdate({ _id: req.params.id, userId: req.user.id  }, {$set: {
        name: req.body.name,
    }}, {new: true})
        .then(category => {
            if (!category) {
                return res.status(404).json({
                    message: 'Category not found'
                });
            }

            res.status(200).json({
                message: 'Category updated',
                category: category
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error updating category',
                error: err
            });
        });
}

exports.deleteCategory = (req, res) => {
    Category.findOneAndRemove({ _id: req.params.id, userId: req.user.id })
        .then(category => {
            if (!category) {
                return res.status(404).json({
                    message: 'Category not found'
                });
            }

            res.status(200).json({
                message: 'Category deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error deleting category',
                error: err
            });
        });
}

exports.getTasksByCategory = (req, res) => {
    Category.findOne({ _id: req.params.id, userId: req.user.id })
        .then(category => {
            if (!category) {
                return res.status(404).json({
                    message: 'Category not found'
                });
            }

            Task.find({ category: category._id })  // Query tasks that belong to the category
                .then(tasks => {
                    if (tasks.length === 0) {
                        return res.status(404).json({
                            message: 'No tasks found for this category'
                        });
                    }
                    
                    // Return the tasks in the response
                    res.status(200).json({
                        tasks: tasks
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'Error retrieving tasks for the category',
                        error: err
                    });
                });

        })
        .catch(err => {
            res.status(500).json({
                message: 'Error getting category tasks',
                error: err
            });
        });
}