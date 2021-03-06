const express = require("express");
const app = express();
const exphbs = require('express-handlebars');
var methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 5000;

const ideas = require('./routes/ideas');
const users = require('./routes/users');

  //Passport config
  require('./config/passport')(passport);
  //DB config  
const db = require('./config/database');

//Map global promise
mongoose.Promise = global.Promise;
//conect to mongoose
mongoose.connect(db.mongoURI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err=>console.log(err));

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

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
//Middleware for flash-connect
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

//Global Variables for flash messages
  app.use(function(req,res,next) {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      res.locals.user = req.user||null;
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


//Use routes
app.use('/ideas', ideas);
app.use('/users', users)

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
});
