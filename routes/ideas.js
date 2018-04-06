const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');
//load the idea model
require('../models/Ideas');
const Idea = mongoose.model('ideas');


//Ideas routes
router.get('/add', ensureAuthenticated, (req, res)=>{
    res.render('ideas/add');
});

//Idea Index Page to display all pages
router.get('/', ensureAuthenticated, (req,res)=>{
    Idea.find({user : req.user.id})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render('ideas/index', {
            ideas:ideas
        });
    });
});

//Process Form for adding idea
router.post('/', (req,res)=>{
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
            details: req.body.details,
            user : req.user.id
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
router.get('/edit/:id', ensureAuthenticated, (req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea => { 
        if(idea.user != req.user.id) {
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/ideas');
        } else {
            res.render('ideas/edit', {
            idea:idea
        });
    }        
    });
});

//To edit an idea
router.put('/:id', ensureAuthenticated, (req,res) => {
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
router.delete('/:id', (req,res) => {
    Idea.remove({_id:req.params.id})
    .then(() => {
        req.flash('success_msg', 'Video Idea removed');
        res.redirect('/ideas');
    });
});

module.exports = router;