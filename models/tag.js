const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User" // Reference to the User model
    }
});

tagSchema.pre('findOneAndRemove', async function (next) {
    try {
        const tagId = this.getQuery()._id; // Get the ID of the tag being deleted
        await mongoose.model('Task').updateMany(
            { tags: tagId }, // Finds all tasks where tags contains the tag being deleted (tagId).
            { $pull: { tags: tagId } } // removes all instances of a tagId from tags.
        );
        next(); // if the updateMany operation is successful, the next() function is called to proceed with the deletion of the tag.
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("Tag", tagSchema);