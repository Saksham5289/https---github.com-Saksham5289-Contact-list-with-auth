const passport = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Load User Model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email,password,done)=>{
            //Match User
            User.findOne({email:email})
            .then(user => {
                if(!user){
                    return done(null, false, {message: 'That email is not registered'}); //Ye jahan null likha ye error ki space hai ,, ye sb ache se ek baar documentation me se refer krlo ..
                }
                //Match Password
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user);
                    }else
                    return done(null,false,{message: 'Password is incorrect'})
                }); // ye password vo hai jo enter hua hai aur user.password vo hai jo database se aaya hai ..
            })
            .catch(err => console.log(err));
        } // ye yellow bracket pr khatam hua hai vo (email,password,done wala function)
        )
    );

passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    });
});

}

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }

    next();
}
