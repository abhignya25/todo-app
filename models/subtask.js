const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subtaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    due: Date,
    status: {
        type: String,
        enum: ["Open", "In Progress", "Completed"]
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low"]
    },
    parentTask: {
        type: Schema.Types.ObjectId,
        ref: "Task", // Reference to the Task model
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User" // Reference to the User model
    }
});

module.exports = mongoose.model("Subtask", subtaskSchema);
