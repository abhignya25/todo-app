const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

// Define routes
// POST /auth/signup
router.post('/signup',
    check('email', 'Please enter a valid email')
        .isEmail()
        .normalizeEmail()
        .trim(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .isAlphanumeric()
        .withMessage('Password must contain letters and numbers')
        .trim(),
    authController.signup
);

// POST /auth/login
router.post('/login',
    check('email', 'Please enter a valid email')
        .isEmail()
        .normalizeEmail()
        .trim(),
    authController.login
);

module.exports = router;