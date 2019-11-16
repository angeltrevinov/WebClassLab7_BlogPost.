const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {DATABASE_URL} = require('./config');

const app = express();
const port = process.env.PORT || 3000;

//connection to mongoDB
mongoose.connect(DATABASE_URL)
    .then(() => {
        console.log('Connected to our database');
    }).catch(() => {
    console.log('connection failed');
});

app.use(express.static('Front'));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: false}));


const Post = require('./models/blog-post-model');

//get all posts
//----------------------------------------------------------
app.get('/api/blog-posts', (req, res, next) => {
    Post.find().then((result) => {
        return res.status(200).json(result);
    }).catch((error) => {
        return res.status(500).json({
            error: error
        });
    });
});

//Find post by author /api/blog-post?author=<value>
//----------------------------------------------------------
app.get('/api/blog-post', (req, res, next) => {
    if(!req.query.author) {
        return res.status(406).json({
            error: 'Missing author in query'
        });
    }

    Post.find({
        author: req.query.author
    }).then((result) => {
        if(result.length > 0) {
            return res.status(200).json(result);
        } else{
            return res.status(404).json({
                error: "no author was found"
            });
        }
    }).catch((error) => {
        return res.status(500).json({
            error: "no author found"
        })
    });
});

//----------------------------------------------------------
app.post('/api/blog-posts', (req, res, next) => {

    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let publishDate = req.body.publishDate;

    if(title && title !== " " &&
        content && content !== " " &&
        author && author !== " " &&
        publishDate && publishDate !== " ") {

        let newPost = {
            title: title,
            content: content,
            author: author,
            publishDate: publishDate
        };

        Post.create(newPost).then((result) => {
            return res.status(201).json({
                message: 'Added Post!'
            });
        }).catch((error) => {
            return res.status(500).json({
                error: error
            });
        })
    } else {
        return res.status(406).json({
            error: 'Missing a field'
        });
    }
});

//----------------------------------------------------------
app.delete('/api/blog-posts/:id', (req, res, next) => {

    Post.findByIdAndRemove({
        _id: req.params.id
    }).then((result) => {
        return res.status(200).json({
            message: 'post deleted'
        });
    }).catch((error) => {
        return res.status(404).json({
            error: 'post not found'
        });
    });
});

//----------------------------------------------------------
app.put('/api/blog-posts/:id', (req, res, next) => {

    if(req.body.constructor === Object &&
        Object.keys(req.body).length === 0
    ){
        return res.status(406).json({
            error: 'no body in request'
        });
    }

    if(req.body.id !== req.params.id){
        return  res.status(409).json({
            error: 'id does not match'
        });
    }

    let newPost = {
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        publishDate: req.body.publishDate
    };

    Post.findByIdAndUpdate(
        {_id: req.body.id},
        newPost
    ).then((result) => {
        return res.status(200).json({
            message: 'Post updated successfully'
        });
    }).catch((error) => {
        return res.status(500).json({
            error: error
        });
    });
});

//----------------------------------------------------------
app.listen(port, () => {
    console.log('App running on local host');
});
