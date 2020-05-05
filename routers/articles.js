const express = require("express");
const router = express.Router();

const Article = require('../models/article');

router.get('/:username/article', (req, res, next) => {
    res.render("articleHome", { username: req.params.username });
});

// Create

router.get('/:username/article/new', (req, res, next) => {

    Article.create(req.body, (err, data) => {
        if (err) {
            return next(err);
        } else {
            res.render("createArticle", { username: data });
        }
    })
})

module.exports = router;