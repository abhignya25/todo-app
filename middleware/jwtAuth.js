const jwt = require('jsonwebtoken');

const { messages, codes } = require('../util/messages');

exports.jwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const error = new Error(messages.NO_AUTH_HEADER);
    error.code = codes.AUTH_ERROR;
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    const error = new Error(messages.NO_AUTH_TOKEN);
    error.code = codes.AUTH_ERROR;
    error.statusCode = 401;
    return next(error);
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    return next();

  } catch (err) {
    const error = new Error(messages.INVALID_TOKEN);
    error.code = codes.AUTH_ERROR;
    error.statusCode = 401;
    return next(error);
  }
};