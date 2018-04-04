const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
var methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session')
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const port = 5000;
//Map global promise
mongoose.Promise = global.Promise;
//conect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
    .then(() => console.log('MongoDB connected...'))
    .catch(err=>console.log(err));

//load the idea model
require('./models/Ideas');
const Idea = mongoose.model('ideas');

// Middleware for Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Middleware for body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Middleware for method-override
app.use(methodOverride('_method'));

//Middleware for express-session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

//Middleware for flash-connect
app.use(flash());

//Global Variables for flash messages
  app.use(function(req,res,next) {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      next();
  });


//Routes
app.get('/', (req,res)=>{
    const title = "Welcome";
    res.render('index', {
        title:title
    });
});

app.get('/about', (req,res)=>{
    res.render('about');
});


//Ideas routes
app.get('/ideas/add', (req, res)=>{
    res.render('ideas/add');
});

//Idea Index Page to display all pages
app.get('/ideas', (req,res)=>{
    Idea.find({})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render('ideas/index', {
            ideas:ideas
        });
    });
});

//Process Form for adding idea
app.post('/ideas', (req,res)=>{
    let errors = [];
    if(!req.body.title){
        errors.push({text:'please add a title'});
    }
    if(!req.body.details){
        errors.push({text:'please add some details'});
    }
    if(errors.length > 0){
        res.render('ideas/add', {
            errors:errors,
            title:req.body.title,
            details:req.body.details
        });
    }
    else{
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
        .save()
        .then(idea=>{
            req.flash('success_msg', 'Video Idea added');
            res.redirect('/ideas');
        })
    }
});

// To view an idea
app.get('/ideas/edit/:id', (req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea=>{
        res.render('ideas/edit', {
            idea:idea
        });
    });
});

//To edit an idea
app.put('/ideas/:id',(req,res) => {
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea => {
        idea.title =req.body.title;
        idea.details =req.body.details;
        idea.save()
        .then(idea =>{            
        req.flash('success_msg', 'Video Idea updated');
            res.redirect('/ideas');
        })
    });
});

//To delete an idea
app.delete('/ideas/:id', (req,res) => {
    Idea.remove({_id:req.params.id})
    .then(() => {
        req.flash('success_msg', 'Video Idea removed');
        res.redirect('/ideas');
    });
});

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
});
