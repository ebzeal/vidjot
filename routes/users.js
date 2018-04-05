const express =require('express');
const app = express();
const mongoose = require('mongoose');
const router = express.Router();
//load the idea model
// require('../models/Users');
// const User = mongoose.model('users');

// user Login
router.get('/login', (req,res) => {
    res.render('users/login');
})

router.get('/register', (req,res) => {
    res.render('users/register');
})

//process registration form
router.post('/register', (req,res) => {
    let errors=[];
    if(!req.body.name){
        errors.push({text: 'Please enter name'});
    }
    if(!req.body.email){
        errors.push({text: 'Please fill in Email'});
    }
    if(!req.body.password){
        errors.push({text: 'Password field cannot be empty'});
    }
    if(req.body.password != req.body.password2){
        errors.push({text: 'Passwords do not match'});
    }
    if(req.body.password < 4){
        errors.push({text: 'Password should be more than 4 characters'});
    }

    if (errors.length > 0){
        res.render('users/register', {
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
        });
    } else {
        res.send('passed');
    }
});

module.exports = router;