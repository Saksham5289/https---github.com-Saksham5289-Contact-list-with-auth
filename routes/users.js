const express= require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')

const User = require('../models/User')

//Login-Page
router.get('/login',(req,res)=> res.render('login'))

//Register_page
router.get('/register',(req,res)=> res.render('register'))

router.post('/register',(req,res)=>{
 const { name, email, password, password2 } = req.body;
let errors = [];

 //check required fields 
 if (!name || !email || !password || !password2)
 {
    errors.push({msg: 'Please fill in all the fields'});
    console.log('error in entries');
 }

 //check password match
 if ( password !== password2)
 {
    errors.push({msg: 'Passwords do not match'});
    console.log('error in passsmatch');
 }

 //Check pass length
 if (password.length < 6)
 {
    errors.push({msg: 'Password should be atleast 6 characters' });
    console.log('error in passlength');
 }

if(errors.length>0){
    res.render('register',{
        errors,
        name,
        email,
        password,
        password2
    });
  
}
else
{
   //Validation passed
   User.findOne({email:email})
   .then(user => {
    if(user){
        //User Exists
        errors.push({msg: 'Email is already registered'});
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        const newUser = new User({
            
        name,
        email,
        password
        //this is same as name: name, email:email, password:password
    
   });
//Hash Password - because hme chupana hai password jo ki user enter karta hai

   bcrypt.genSalt(10, (err,salt)=>{
    bcrypt.hash(newUser.password, salt, (err,hash)=>{
        if(err) throw err ;
        //Set password to hashed
        newUser.password = hash;
        //Save User
        newUser.save()
        .then(user =>{
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/users/login');
        })
        .catch(err => console.log(err));
    })
   })
   
}


});
}});

//Login Handle 
router.post('/login',(req,res,next) => {
 passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
 })(req,res,next);
});

//Logout Handle
router.get('/logout',(req,res) => {
    req.logout(req.user, err => {
        if(err) return next(err);
        
    });
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
}); 

module.exports = router;