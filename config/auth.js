module.exports = {
    ensureAuthenticated: function(req,res,next){
        if (req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/users/login');
    }
}

// so this is basically a middleware and any route that we want to be protected ,we just need to bring this middleware over there 