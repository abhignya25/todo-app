const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User" // Reference to the User model
    }
});

categorySchema.pre('findOneAndRemove', async function (next) {
    try {
        const categoryId = this.getQuery()._id; 
        await mongoose.model('Task').updateMany(
            { category: categoryId }, 
            { $set: { category: null } } 
        );
    }
    catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("Category", categorySchema);

