const express = require('express');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')
const path = require('path'); 
const bodyParser = require('body-parser');

const app = express();

//Passport config
require('./config/passport')(passport); // ye hmne config file ko passport supply kiya hai 

//DB config
const db = require('./config/keys').MongoURI;

//Connect to Mongo

mongoose.connect(db, {useNewUrlParser: true})
.then(()=>console.log('Database connected Successfully'))
.catch((err)=>console.log(err));

const MongoStore = require('connect-mongo');
//EJS (using middleware)
app.use(expressLayouts); //this ordering of keeping it above needs to be right
app.set('view engine','ejs');
app.use(express.static('assets'));
//Bodyparser
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
//Express session middleware
app.use(session({
    secret: 'keyboard cat', // does not matter what this is 
    resave: true, // by-default false tha 
    saveUninitialized: true,
    cookie: {
      maxAge: (1000 * 60 * 100)
  },
  store: MongoStore.create({ mongoUrl: db })
    // cookie: { secure: true } //tutorial me kaha ki need nahi hai
  }));

//Passport middleware // Its location is important
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

  //Connect flash
  app.use(flash());

  //Global variables
   app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
   })




//Routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'));

const PORT  = process.env.PORT || 5000 ;//this is basically that if on local host ,we will use 5000 else case is if we deploy it 

app.listen(PORT, console.log(`Server started on ${PORT}`));
