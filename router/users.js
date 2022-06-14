const express = require('express');
const router = express.Router();
const User = require('../models/User');

const passport = require('passport');

router.get("/users/success", (req, res) => {
    res.render("index", {titulo : "TwinSanity"});
})
router.get("/users/signup", (req, res) => {
    res.render("register", {titulo : "TwinSanity"});
})
router.get("/users/success", (req, res) =>{
    res.render("index");
})
router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/users/success',
    failureRedirect: '/',
    failureFlash: true
}));

router.post('/users/signup', async (req,res)=>{
    const { name, email, pass, c_pass } = req.body;
    const errors = [];
    if(pass!=c_pass){
        errors.push({text: 'La contraseña no coincide'})
    } else{
        const emailUser = await User.findOne({email: email})
        if(emailUser){
            req.flash('error_msg','El correo esta en uso');
            res.redirect('/users/signup');
        }
        const newUser = new User({name, email, pass});
        newUser.pass = await newUser.encryptPwd(pass);
        await newUser.save();
        req.flash('success_msg', 'Estas registrado!');
        res.redirect('/');
    }
});

module.exports = router;