// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create Article Schema
var ArticleSchema = new Schema({
    // title is a string and required
    title: {
        type: String,
        required: true
    },
    // link is a string and required
    link: {
        type: String,
        required: true
    },
    
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

// Create the article model with ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;