const { messages, codes } = require('../util/messages');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || messages.INTERNAL_SERVER_ERROR;
    const errors = err.errors || null;
    const code = err.code || codes.SERVER_ERROR;

    if (errors) {
        return res.status(statusCode).json(errors.map(error => {
            return {
                code: error.code || code,
                message: error.msg,
            };
        }));
    }

    return res.status(statusCode).json({
        code: code,
        message: message
    });
};

module.exports = errorHandler;