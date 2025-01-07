const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require("../models/user");
const { messages, codes } = require('../util/messages');

exports.signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error(messages.VALIDATION_FAILED);
            error.statusCode = 422;
            error.errors = errors.array();
            error.code = codes.VALIDATION_ERROR;
            return next(error);
        }

        if (!email || !password) {
            const error = new Error(messages.REQUIRED_FIELDS);
            error.statusCode = 400;
            error.code = codes.VALIDATION_ERROR;
            return next(error);
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error(messages.USER_EXISTS);
            error.statusCode = 409;
            error.code = codes.RESOURCE_EXISTS;
            return next(error);
        }

        const hashedPassword = await bcrypt.hash(password, 15);

        const newUser = new User({
            email,
            name,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: messages.USER_REGISTERED,
            user: { id: newUser._id, email: newUser.email, name: newUser.name },
        });
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error(messages.VALIDATION_FAILED);
            error.statusCode = 422;
            error.errors = errors.array();
            error.code = codes.VALIDATION_ERROR;
            return next(error);
        }

        if (!email || !password) {
            const error = new Error(messages.EMAIL_PASSWORD_REQUIRED);
            error.statusCode = 400;
            error.code = codes.VALIDATION_ERROR;
            return next(error);
        }

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error(messages.INCORRECT_EMAIL);
            error.statusCode = 401;
            error.code = codes.RESOURCE_DOES_NOT_EXIST;
            return next(error);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('messages.INCORRECT_PASSWORD');
            error.statusCode = 401; 
            error.code = codes.VALIDATION_ERROR;
            return next(error);
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
        );

        res.status(200).json({
            message: messages.LOGIN_SUCCESS,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        err.statusCode = 500;
        return next(err);
    }
};
