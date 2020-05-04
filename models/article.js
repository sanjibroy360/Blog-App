const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    
    title: String,
    content : String,
    tags : [String],
    author_name: String,
    author: {
        type : Schema.Types.ObjectId,
        refs: 'User'
    },
    
    like: {
        type: Number,
        default: 0
    }

},{timestamps : true});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;