// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

const errorHandler = require('./middleware/errorHandler');

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
