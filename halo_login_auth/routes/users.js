const express = require('express');
const { request } = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');

router.get("/login", (req,res) => res.render('login'));

router.get("/register", (req,res) => res.render('register'));

router.post("/register", (req,res) => {
    const { name, email, password, password2, address, phone } = req.body;
    let errors = [];

    if(!name || !email || !password || !password2 || !address || !phone){
        errors.push({msg: "please fill in all fields"});
    }

    if(password !== password2){
        errors.push({msg: "Password and Confirm password must match"});
    }

    if(password.length<6){
        errors.push({msg: "Password must be atleast 6 characters"});
    }

    if (errors.length>0) {
        res.render("register", {
            errors,
            name,
            email,
            password,
            password2,
            address,
            phone
        });
    } else{
        User.findOne({email: email})
        .then(user => {
            errors.push({msg: "email is already registered"});
            if(user) {
                res.render("register", {
                    errors,
                    name,
                    email,
                    password,
                    password2,
                    address,
                    phone
                });

            } else{
                const newUser = new User({
                    name,
                    email,
                    password,
                    address,
                    phone
                });
                
                bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'You are now registered and can log in');
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                }))

            }
        });
    }  

});

router.post("/login", (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash('success_msg', 'you are logged out');
    res.redirect('/users/login');
});


module.exports = router;