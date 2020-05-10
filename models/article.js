const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    
    title : {
        maxlength: 40,
        type: String,
        require: true
    },

    description: String,

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    likes : {
        default: 0,
        type: Number,
        min: 0
    },

    comments : [{
        type: Schema.Types.ObjectId,
        ref : "Comment"
    }],
    
    tags : [String],

}, {timestamps : true});

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;