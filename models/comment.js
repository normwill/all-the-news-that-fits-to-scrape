// Require mongoose
var mongoose = require("mongoose");
// Create schema class
var Schema = mongoose.Schema;

// Create a Comment schema
var CommentSchema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String
    }
});

// Create the comment model with CommentSchema
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;