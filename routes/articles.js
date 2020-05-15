const express = require("express");
const router = express.Router();

const User = require('../models/user');
const Article = require('../models/article');
const Comment = require('../models/comment');

const commentRouter = require('./comments.js');

const auth = require('../middleware/auth');



// Show all articles

router.get('/', (req, res, next) => {
    Article.find({}, (err, articles) => {
        if(err) return next(err); 
        res.render("articleHome", {articles});  
    })

});

// Read Article

router.get('/:id/read', (req, res, next) => {
    
    
    let articleId = req.params.id;
    console.log("ArticleId" , articleId);
    
    // Article.findById(articleId, (err, article) => {
    //     if(err) return next(err);
    //     article.createdAt = String(article.createdAt);

    

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
            res.render("showContent", { article, comments});

        })
    })

})


// Prevent

router.use(auth.checkLogin);

// Create Articles

router.get('/new', (req, res, next) => {
    res.render("createArticle");
});

router.post('/',(req, res, next) => {

    req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
    
    req.body.author = req.session.userId || req.session.passport.user;
    Article.create(req.body, (err, data) => {
        if(err) return next(err);
        res.render("success",{msg : "Article Created Successfully"})
    }) 

})
  
// Update Article

router.get('/:id/edit', (req, res, next) => {
    let id = req.params.id;
    Article.findById(id, (err, article) => {
        if(err) return next(err);
        res.render('editArticles',{article});
    })
})

router.post('/:id/edit', (req, res, next) => {
    
    let id = req.params.id;
    req.body.tags = req.body.tags.split(",").map(tag => tag.trim());
    Article.findByIdAndUpdate(id, req.body, (err, updatedArticle)=> {
        if(err) return next(err);
        res.render("success", {msg : "User Updated Successfully!"});
    })
    
});

// Delete Article

router.get('/:id/delete', (req, res, next) => {
    let id = req.params.id;
    Article.findByIdAndDelete(id, (err, data) => {
        if(err) return next(err);

        Comment.deleteMany({articleId : id}, (err) => {
            if(err) return next(err);
        })
        res.render("success", {msg: "User Deleted Successfully!"});
    })
});


// like

router.get('/:id/like', (req, res, next) => {
    let id = req.params.id;
    Article.findByIdAndUpdate({_id: id},{$inc : {likes : 1}}, (err, article) => {
        if(err) return next(err);
        console.log(article);
        res.redirect(`/articles/${id}/read`);
    })
})

// unlike

router.get('/:id/unlike', (req, res, next) => {
    let id = req.params.id;

    Article.findById(id, (err, article) => {
        if(err) return next(err);

        else if(article.likes > 0) {

            Article.findByIdAndUpdate({_id: id},{$inc : {likes : -1}}, (err, article) => {
                if(err) return next(err);
                console.log("updated"); 
            })
        }
        res.redirect(`/articles/${id}/read`);
    })

    
})

// Comments

router.post('/:articleId/comments', (req, res, next) => {

    let id = req.params.articleId;
    let articleId = id;
    req.body.articleId = id;
    req.body.content = req.body.content.trim();
    req.body.author = req.session.userId || req.session.passport.user;
    
    Comment.create(req.body, (err, comment) => {
        if(err) return next(err);

        Article.findByIdAndUpdate(articleId,
        {$push : {comments: comment.id}} 
        ,(err, article) => {
            if(err) return next(err);
            console.log("article updated", article);
            res.redirect(`/articles/${id}/read`);
        })
    })
})

router.use('/', commentRouter);

module.exports = router;