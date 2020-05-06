const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Article = require('../models/article');

// Edit

router.get('/:articleId/comments/:commentId/edit', (req, res, next) => {

    let commentId = req.params.commentId;
    let articleId = req.params.articleId;

    Article.findById(articleId, (err, article) => {

        if (err) return next(err);

        Comment.find({}, (err, allComments) => {

            if (err) return next(err);

            Comment.findById(commentId, (err, comment) => {
                if (err) return next(err);
                console.log(comment);
                res.render("editComment", { article, allComments, comment })
            })

        })

    })

})

router.post("/:articleId/comments/:commentId/edit", (req, res, next) => {

    let commentId = req.params.commentId;
    let articleId = req.params.articleId;

    Comment.findByIdAndUpdate(commentId, req.body, (err, updatedComment) => {
        if (err) return next(err);

        Article.findById(articleId, (err, article) => {
            if (err) return next(err);
            article.createdAt = String(article.createdAt);

            // Display Comments

            Comment.find({ articleId }, (err, comments) => {
                if (err) return next(err);
                res.render("showContent", { article, comments });
            })
        })
    })
})


// Delete

router.get('/:articleId/comments/:commentId/delete', (req, res, next) => {

    let articleId = req.params.articleId;
    let commentId = req.params.commentId;

    Comment.findByIdAndDelete(commentId, (err, data) => {
        if (err) return next(err);

        Article.findOneAndUpdate({ _id: articleId }, { $pull: { comments: commentId } }, (err, updatedArticle) => {
            if (err) return next(err);
            res.redirect(`/articles/${articleId}`);
        });

    })
})

module.exports = router;