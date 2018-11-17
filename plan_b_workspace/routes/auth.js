var express = require("express");
var passport = require("passport");

var User      = require("../models/user.js");

var router = express.Router();

router.get("/login", function(req, res){
   res.render("login") 
});

router.get("/register", function(req, res){
   res.render("register"); 
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err) {
           console.log(err);
           return res.redirect("/");
       } else {
           passport.authenticate("local")(req, res, function(){
               res.redirect("/main");
           });
       }
    });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/main",
    failureRedirect: "/login"
}), function(req, res){
    //
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})



module.exports = router