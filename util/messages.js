exports.codes = {
    VALIDATION_ERROR: 'validation_error',
    SERVER_ERROR: 'server_error',
    AUTH_ERROR: 'auth_error',
    RESOURCE_EXISTS: 'resource_exists',
    RESOURCE_DOES_NOT_EXIST: 'resource_does_not_exist'
}

exports.messages = {
    INTERNAL_SERVER_ERROR: 'An internal server error occurred.',
    NO_AUTH_HEADER: 'Authentication failed: Missing Authorization header.',
    NO_AUTH_TOKEN: 'Authentication failed: Token not found.',
    INVALID_TOKEN: 'Authentication failed: Invalid or expired token.',
    VALIDATION_FAILED: 'Validation failed. Invalid input.',
    REQUIRED_FIELDS: 'All fields are required.',
    USER_EXISTS: 'User already exists. Please log in.',
    USER_REGISTERED: 'User registered successfully!',
    EMAIL_PASSWORD_REQUIRED: 'Email and password are required.',
    INCORRECT_PASSWORD: 'Incorrect password.',
    INCORRECT_EMAIL: 'Incorrect email.',
    LOGIN_SUCCESS: 'Login successful!',
}