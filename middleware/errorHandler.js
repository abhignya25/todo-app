const { messages, codes } = require('../util/constants');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || messages.INTERNAL_SERVER_ERROR;
    const errors = err.errors || null;
    const code = err.code || codes.SERVER_ERROR;

    if (errors) {
        return res.status(statusCode).json({
                code: errors[0].code || code,
                message: errors[0].msg,
            });
    }

    return res.status(statusCode).json({
        code: code,
        message: message
    });
};

module.exports = errorHandler;