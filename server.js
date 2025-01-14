// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config({ path: './config/.env' });

const errorHandler = require('./middleware/errorHandler');
const swaggerDefinition = require('./swagger/swaggerDef');

// Initialize the app
const app = express();

// Access environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

// Import routes
const tagRoutes = require('./routes/tag');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const subtaskRpoutes = require('./routes/subtask');
const categoryRoutes = require('./routes/category');


// Register middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Path to your route files
};
const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Register routes
app.use('/tags', tagRoutes);
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/subtasks', subtaskRpoutes);
app.use('/categories', categoryRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => {
        app.listen(PORT);
    })
    .catch(err => {
        console.log('Error: ', err);
    });
