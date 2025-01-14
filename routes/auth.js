const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const { messages } = require('../util/constants');

// Define routes
// POST /auth/signup
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for the user account
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: Required fields missing
 *       409:
 *         description: User already exists
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for the user account
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Email and password required
 *       401:
 *         description: Incorrect email or password
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/login',
    check('email', messages.VALID_EMAIL)
        .trim()
        .isEmail()
        .normalizeEmail(),
    authController.login
);

module.exports = router;