const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Article = require('../models/article');

// Edit

router.get('/:articleId/comments/:commentId/edit', (req, res, next) => {

    let commentId = req.params.commentId;
    let articleId = req.params.articleId;

    // Article.findById(articleId, (err, article) => {

    //     if (err) return next(err);

    //     Comment.find({articleId : articleId}, (err, allComments) => {

    //         if (err) return next(err);

    //         Comment.findById(commentId, (err, targetComment) => {

    //             if (err) return next(err);
    //             targetComment.content = targetComment.content.trim();
    //             res.render("editComment", { article, allComments, targetComment });

    //         })

    //     })

    // })

    Article
    .findById(articleId)
    .populate("author", "name") 
    .exec((err, article) => {
        if(err) return next(err);

        Comment
        .find({articleId})
        .populate("author", "name")
        .exec((err, comments) => {

            if(err) return next(err);

            Comment.findById(commentId, (err, targetComment) => {

                if (err) return next(err);
                

                // let currentUser = req.session.userId;
                res.render("editComment", { article, comments, targetComment });
            
            })
            
            

        })
    })

})

router.post("/:articleId/comments/:commentId/edit", (req, res, next) => {

    let commentId = req.params.commentId;
    let articleId = req.params.articleId;
    let targetComment = commentId;

    Article
    .findById(articleId)
    .populate("author", "name") 
    .exec((err, article) => {
        if(err) return next(err);

        Comment
        .find({articleId})
        .populate("author", "name")
        .exec((err, comments) => {

            if(err) return next(err);

            Comment.findByIdAndUpdate(commentId, req.body, {new: true} ,(err, targetComment) => {

                if (err) return next(err);
                console.log("targetComment: ",targetComment);
                res.redirect(`/articles/${articleId}/read`)

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
            res.redirect(`/articles/${articleId}/read`);
        });

    })
})

module.exports = router;