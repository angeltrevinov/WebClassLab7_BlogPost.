const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');//unique id with timestamp

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: false}));

let listPosts = [
    {
        id: uuid(),
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        author: "Angel Treviño",
        publishDate: new Date()
    },
    {
        id: uuid(),
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi tempus imperdiet nulla malesuada pellentesque elit. Urna et pharetra pharetra massa massa ultricies mi. Magna sit amet purus gravida quis blandit. Dignissim diam quis enim lobortis scelerisque. Eu mi bibendum neque egestas congue. Purus sit amet volutpat consequat mauris nunc congue nisi vitae. In tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Eu augue ut lectus arcu bibendum at. Adipiscing elit duis tristique sollicitudin nibh sit. Nascetur ridiculus mus mauris vitae ultricies.",
        author: "Noe Campos",
        publishDate: new Date()
    },
    {
        id: uuid(),
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi tempus imperdiet nulla malesuada pellentesque elit. Urna et pharetra pharetra massa massa ultricies mi. Magna sit amet purus gravida quis blandit. Dignissim diam quis enim lobortis scelerisque. Eu mi bibendum neque egestas congue. Purus sit amet volutpat consequat mauris nunc congue nisi vitae. In tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Eu augue ut lectus arcu bibendum at. Adipiscing elit duis tristique sollicitudin nibh sit. Nascetur ridiculus mus mauris vitae ultricies.",
        author: "Caro Peyrot",
        publishDate: new Date()
    }
];

//get all posts
//----------------------------------------------------------
app.get('/api/blog-posts', (req, res, next) => {
    return res.status(200).json(listPosts);
});

//Find post by author /api/blog-post?author=<value>
//----------------------------------------------------------
app.get('/api/blog-post', (req, res, next) => {
    if(!req.query.author) {
        return res.status(406).json({
            error: 'Missing author in query'
        });
    }

    let post = listPosts.find((post) => {
        return post.author.toLowerCase().includes(
            req.query.author.toLowerCase()
        );
    });

    if(post) {
        return res.status(200).json(post);
    } else {
        return res.status(404).json({
            error: 'No author found'
        });
    }
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
            id: uuid(),
            title: title,
            content: content,
            author: author,
            publishDate: publishDate
        };

        listPosts.push(newPost);

        return res.status(201).json({
            message: 'Added Post!'
        });
    } else {
        return res.status(406).json({
            error: 'Missing a field'
        });
    }
});

//----------------------------------------------------------
app.delete('/api/blog-posts/:id', (req, res, next) => {
    let post = listPosts.findIndex(post => {
        return post.id === req.params.id;
    });

    if(post !== -1) {
        console.log(post);
        listPosts.splice(post, 1);
        return res.status(200).json({
            message: 'post deleted'
        });
    } else {
        return res.status(404).json({
            error: 'post not found'
        });
    }
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

    let post = listPosts.find(post => {
        return post.id === req.params.id;
    });

    if(req.body.author && req.body.author !== ' ') {
        post.author = req.body.author;
    }

    if(req.body.title && req.body.title !== ' '){
        post.title = req.body.title;
    }

    if(req.body.content && req.body.content !== ' '){
        post.content = req.body.content;
    }

    if(req.body.publishDate && req.body.publishDate) {
        post.publishDate = req.body.publishDate;
    }

    return res.status(202).json({
        message: 'Post updated!'
    });
});

//----------------------------------------------------------
app.listen('8080', () => {
    console.log('App running on local host');
});