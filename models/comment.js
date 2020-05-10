var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    content : {
        type: String,
        required: true,
        trim: true
    },
    author : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    articleId : [{
        type: Schema.Types.ObjectId,
        ref: "Article",
        required: true
    }],


}, {timestamps: true});

var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;