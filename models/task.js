const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
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
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category" // Reference to the Category model
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "Tag" // Reference to the Tag model
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User" // Reference to the User model
    }
});

taskSchema.pre('findOneAndRemove', async function (next) {
    try {
        const taskId = this.getQuery()._id;
        await mongoose.model('Subtask').deleteMany({ parentTask: taskId });
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("Task", taskSchema);