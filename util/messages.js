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
    CATEGORY_CREATED_SUCCESSFULLY: 'Category created successfully',
    CATEGORY_ERROR: 'Error creating category',
    CATEGORY_NOT_FOUND: 'Category not found',
    CATEGORY_UPDATED: 'Category updated successfully',
    CATEGORY_DELETED: 'Category deleted successfully',
    CATEGORY_TYPE: 'Category name must be a string',
    CATGEORY_LENGTH: 'Category name must be between 3 and 50 characters',
    TAG_CREATED_SUCCESSFULLY: 'Tag created successfully',
    TAG_ERROR: 'Error creating tag',
    TAG_NOT_FOUND: 'Tag not found',
    TAG_UPDATED: 'Tag updated successfully',
    TAG_DELETED: 'Tag deleted successfully',
    TAG_TYPE: 'Tag name must be a string',
    TAG_LENGTH: 'Tag name must be between 3 and 20 characters',
    SUBTASK_CREATED_SUCCESSFULLY: 'Subtask created successfully',
    SUBTASK_DELETED: 'Subtask deleted successfully',
    SUBTASK_NOT_FOUND: 'Subtask not found',
    SUBTASK_UPDATED: 'Subtask updated successfully',
    SUBTASK_ERROR: 'Error creating subtask',
    SUBTASK_TITLE_TYPE: 'Subtask title must be a string',
    SUBTASK_TITLE_LENGTH: 'Subtask title must be between 3 and 100 characters',
    SUBTASK_DESCRIPTION_TYPE: 'Subtask description must be a string',
    SUBTASK_DESCRIPTION_LENGTH: 'Subtask description must be between 0 and 200 characters',
    SUBTASK_PRIORITY_TYPE: 'Priority must be one of "High", "Medium", "Low"',
    SUBTASK_STATUS_TYPE: 'Status must be one of "Not Started", "In Progress", "Completed"',
    SUBTASK_DUE_TYPE: 'Subtask due must be a date',
    TASK_NOT_FOUND: 'Task not found',
}

exports.status = ["Open", "In Progress", "Completed"]

exports.priorities = ["High", "Medium", "Low"]
