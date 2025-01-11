const mongoose = require("mongoose");

const { status, priorities } = require("../util/constants");

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
        enum: status
    },
    priority: {
        type: String,
        enum: priorities
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category" // Reference to the Category model
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "Tag" // Reference to the Tag model
    }],
    files: [{
        filename: {
            type: String, 
            required: true
        },
        path: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        mimetype: {
            type: String,
            required: true
        }
    }],
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User" // Reference to the User model
    },
}, { timestamps: true });

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