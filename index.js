const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Post = require('./schemas/post');
const User = require('./schemas/user');
const Comment = require('./schemas/comment');
const post = require('./schemas/post');


const mongoDb = 'mongodb://127.0.0.1/mongoose-codealong';
mongoose.connect(mongoDb, {useNewUrlParser: true});
const db = mongoose.connection;

db.once('open', () => {
    console.log(`Connected to mongoDb at ${db.host}:${db.port}`);
});

db.on('error', (error) => {
    console.log(`Database error: ${error}`);
})



app.use(express.urlencoded({ extended: false}));



//home route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to our API'
    })
})

//USERS ROUTES *****************************************************
//GET all users route
app.get('/users', (req, res) => {
    User.find({})
    .then(users => {
        console.log('All users', users);
        res.json({ users: users });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

//get user by email
app.get('/users/:email', (req, res) => {
    console.log('find user by', req.params.email)
    User.findOne({
        email: req.params.email
    })
    .then(user => {
        console.log('Here is the user', user.name);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

//POST users
app.post('/users', (req, res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,
        meta: {
            age: req.body.age,
            website: req.body.website
        }
    })
    .then(user => {
        console.log('New user =>>', user);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

// PUT Route
app.put('/users/:email', (req, res) => {
    console.log('route is being on PUT')
    User.findOne({ email: req.params.email })
    .then(foundUser => {
        console.log('User found', foundUser);
        User.findOneAndUpdate({ email: req.params.email }, 
        { 
            name: req.body.name ? req.body.name : foundUser.name,
            email: req.body.email ? req.body.email : foundUser.email,
            meta: {
                age: req.body.age ? req.body.age : foundUser.age,
                website: req.body.website ? req.body.website : foundUser.website
            }
        })
        .then(user => {
            console.log('User was updated', user);
            res.redirect(`/users/${req.params.email}`)
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
    
});

//DELETE Route
app.delete('/users/:email', (req, res) => {
    User.findOneAndRemove({ email: req.params.email })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.email} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});

//POSTS ROUTES ***************************************************************
//Find all posts
app.get('/posts', (req, res) => {
    Post.find({})
    .then(posts => {
        console.log('All posts', posts);
        res.json({ posts: posts });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

//Get post by title
// app.get('/posts/:title', (req, res) => {
//     console.log('find post by', req.params.title)
//     Post.findOne({
//         title: req.params.title
//     })
//     .then(post => {
//         console.log('Here is the post', post.title);
//         res.json({ post: post });
//     })
//     .catch(error => { 
//         console.log('error', error);
//         res.json({ message: "Error ocurred, please try again" });
//     });
// });

// Get post by Id
app.get('/posts/:id', (req,res) => {
    Post.findById(req.params.id)
    .then(posts => {
        console.log('This post', posts);                 //this is an example of above route but using :id instead of :title. Can only have one route using req.params (:something) because they mean the same thing to the server, so the first route is the one that gets read
        res.json({ posts: posts });
    })
    .catch(error => { 
        console.log('error >>>>>>', error) 
    });
});

//POST route for new post
app.post('/posts', (req, res) => {
    Post.create({
        title: req.body.title,
        body: req.body.body,
        comment: {
            header: req.body.header,
            content: req.body.content
            
        }
    })
    .then(post => {
        console.log('New post =>>', post);
        res.json({ post: post });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

// PUT Route for posts
app.put('/posts/:title', (req, res) => {
    console.log('route is being on PUT')
    Post.findOne({ title: req.params.title })
    .then(foundPost => {
        console.log('Post found', foundPost);
        Post.findOneAndUpdate({ title: req.params.title }, 
        { 
            title: req.body.title ? req.body.title : foundPost.title,
            body: req.body.body ? req.body.body : foundPost.body,
            comments: {
                header: req.body.header ? req.body.header : foundPost.header,
                content: req.body.content ? req.body.content : foundPost.content
            }
        })
        .then(post => {
            console.log('Post was updated', post);
            res.redirect(`/posts/${req.params.title}`)
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
    
});

//DELETE Route for POST
app.delete('/posts/:title', (req, res) => {
    Post.findOneAndRemove({ title: req.params.title })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.title} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});

//Comments ROUTES ***************************************************************

//GET all comments route
app.get('/comments', (req, res) => {
    Comment.find({})
    .then(comments => {
        console.log('All comments', comments);
        res.json({ comments: comments });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

//get comment by id
app.get('/comments/:id', (req,res) => {
    Comment.findById(req.params.id)
    .then(comment => {
        console.log('This comment', comment);                 //this is an example of above route but using :id instead of :title. Can only have one route using req.params (:something) because they mean the same thing to the server, so the first route is the one that gets read
        res.json({ comment: comment });
    })
    .catch(error => { 
        console.log('error >>>>>>', error) 
    });
});


//Get all comments on post by id
app.get('/posts/:id/comments', (req, res) => {
    Post.findById(req.params.id).populate('comments').exec()
    .then(post => {
        console.log('here is the post', post);
    })
})



//POST comments
app.post('/posts/:id/comments', (req, res) => {
    Post.findById(req.params.id)
    .then(post => {
        console.log('Heyyy, this is the post', post);
        // create and pust comment inside of post
        Comment.create({
            header: req.body.header,
            content: req.body.content
        })
        .then(comment => {
            post.comments.push(comment);
            // save the post
            post.save();
            res.redirect(`/posts/${req.params.id}`);
        })
        .catch(error => { 
            console.log('error', error);
            res.json({ message: "Error ocurred, please try again" });
        });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

// PUT Route
app.put('/comments/:id', (req, res) => {
    console.log('route is being on PUT')
    Comment.findById(req.params.id)
    .then(foundComment => {
        console.log('Comment found', foundComment);
        Comment.findByIdAndUpdate(req.params.id, { 
                header: req.body.header ? req.body.header : foundComment.header,
                content: req.body.content ? req.body.content : foundComment.content,
        }, { 
            upsert: true 
        })
        .then(comment => {
            console.log('Comment was updated', comment);
            res.redirect(`/comments/${req.params.id}`);
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
});

//Delete route
app.delete('/comments/:id', (req, res) => {
    Comment.findByIdAndRemove(req.params.id)
    .then(response => {
        console.log('This was deleted', response);
        res.json({ message: `Comment ${req.params.id} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});










// mongoose fetch
// app.get('/', (req, res) => {
//     const bobby = new User({
//         name: 'Bobby',
//         email: 'bobby@test.com',
//         meta: {
//             age: 27,
//             website: 'https://chris.me'
//         }
//     });
    
//     bobby.save((err) => {
//         if (err) return console.log(err);
//         console.log('User Created!');
//     });
//     res.send(bobby.sayHello());
// })

// app.get('/findAll', (req, res) => {
//     User.find({}, (err, users) => {
//         if (err) res.send(`Failed to find record, mongodb error ${err}`);
//         res.send(users);
//     })
// })

// app.get('/findById/:id', (req, res) => {
//     User.findById( req.params.id, (err, users) => {
//         if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
//         res.send(users);
//     })
// })

// app.get('/findByEmail/:email', (req, res) => {
//     User.findOne({}, (err, users) => {
//         if (err) res.send(`Failed to find record by email, mongodb error ${err}`);
//         res.send(users);
//     })
// })

//Mongoose create statements
// //creatung ysers directly from model using model.save() and creating user using mode.create 
// User.create({
//     name: 'created using create',
//     email: 'testererr@gmail.com'
// })

// const newPost = new Post ({
//     title: "test",
//     body: "testing create post"
// });

// newPost.save((err) => {
//     if (err) return console.log(err);
//     console.log("created new post")
// });

//creating new Comment //////////////////////////////////////////////////
// const refComment = new Comment ({
//     header: "test",
//     content: "testing create comment"
// });

// refComment.save((err) => {
//     if (err) return console.log(err);
//     console.log("created new comment")
// });



//Creating a simple post document in the post collection
// Post.create({
//     header: 'testComment',
//     content: 'This is post content...',
    
// });


// Post.create({
//         content: 'This is post content...',
//         title: 'Test'
//     });


//Mongoose update statements

// User.updateOne({name: 'Robert'}, {
//     meta: {
//         age: 56
//     }
// }, (err, updateOutcome) => {
//     if (err) return console.log(err);
//     console.log(`updated user: ${updateOutcome.matchedCount} : ${updateOutcome.modifiedCount}`)
// })


//returns full object prior to update
// User.findOneAndUpdate({name: 'Robert'},
// {
//     meta: {
//         website: 'Somethingdifferent.com'
//     }
// }, (err, user) => {
//     if (err) return console.log(err);
//     console.log(user);
// })


//mongoose delete statements(deletes all that match) 
// User.remove({name: 'Robert'}, (err) => {
//     if (err) return console.log(err)
//     console.log('user record deleted');
// })


//deletes one instance
// User.findOneAndRemove({name: 'Chris'}, (err, user) => {
//     if (err) return console.log(err);
//     console.log(user);
// })

//Post schema wth association to comments
// const newPost = new Post({
//     title: 'our new post',
//     body: 'some body text for our post',
// })

// newPost.comments.push({
//     header: 'our first comment',
//     content: 'this is my comment text',
// })

// newPost.save(function(err) {
//     if (err) return console.log(err)
//     console.log(`Created post ${this.title}`)
// })

// const refPost = new Post({
//     title: 'Post with ref to comments',
//     body: 'Body for ref with comments'
// })

// const refComment = new CommentModel({
//     header: 'Our ref comment',
//     content: 'some comment content'
// });

// refComment.save();

// refPost.comments.push(refComment);
// refPost.save();





app.listen(8000, () => {
    console.log('Running on port 8000')
})