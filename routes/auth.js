const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const { messages } = require('../util/constants');

// Define routes
// POST /auth/signup
router.post('/signup',
    check('email', messages.VALID_EMAIL)
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage(messages.PASSWORD_LENGTH)
        .isAlphanumeric()
        .withMessage(messages.VALID_PASSWORD),
    authController.signup
);

// POST /auth/login
router.post('/login',
    check('email', messages.VALID_EMAIL)
        .trim()
        .isEmail()
        .normalizeEmail(),
    authController.login
);

module.exports = router;