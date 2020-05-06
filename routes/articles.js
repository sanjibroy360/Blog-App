const express = require("express");
const router = express.Router();

const Comment = require('../models/comment');
const commentRouter = require('./comments.js');
const Article = require('../models/article');

// Show all articles

router.get('/', (req, res, next) => {
    console.log("hello");
    Article.find({}, (err, articles) => {
        if(err) return next(err);
        res.render("articleHome", {articles});
    })
});

// Create Articles

router.get('/new', (req, res, next) => {
    res.render("createArticle");
});

router.post('/', (req, res, next) => {
    req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
    console.log(req.body);
   
    Article.create(req.body, (err, data) => {
        if(err) return next(err);
        res.render("success",{msg : "Article Created Successfully"})
    })  

})


// Read Article

router.get('/:id', (req, res, next) => {
    
    let id = req.params.id;
    let articleId = id;
    
    Article.findById(id, (err, article) => {
        if(err) return next(err);
        article.createdAt = String(article.createdAt);

        // Display Comments

        Comment.find({articleId}, (err, comments) => {
            if(err) return next(err);
            res.render("showContent", {article, comments});
        })
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
    
    let id = req.params.id;value="<%= comment.name %>"
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

        Comment.deleteMany({articleId : id}, (err, data) => {
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
        res.redirect(`/articles/${id}`);
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
        res.redirect(`/articles/${id}`);
    })

    
})

// Comments

router.post('/:articleId/comments', (req, res, next) => {

    let id = req.params.articleId;
    let articleId = id;
    req.body.articleId = id;
    Comment.create(req.body, (err, comment) => {
        if(err) return next(err);

        Article.findByIdAndUpdate(articleId,
        {$push : {comments: articleId}} 
        ,(err, article) => {
            if(err) return next(err);
            res.redirect(`/articles/${id}`);
        })
    })
})

router.use('/', commentRouter);

module.exports = router;