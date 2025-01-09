const mongoose = require("mongoose");

const { status, priorities } = require("../util/constants");

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
        enum: status
    },
    priority: {
        type: String,
        enum: priorities
    },
    parentTask: {
        type: Schema.Types.ObjectId,
        ref: "Task", // Reference to the Task model
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User" // Reference to the User model
    }
}, { timestamps: true });

module.exports = mongoose.model("Subtask", subtaskSchema);
