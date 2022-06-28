const usersCtrl= {};

const passport = require('passport');

const User= require('../models/user')


usersCtrl.renderSignUpForm= (req, res) => {
    const errors = [];
    const name = "";
    const username = "";
    const email = "";
    res.render('signup', {
        errors,
        name,
        username,
        email,
    });
};

usersCtrl.signup = async (req, res) => {
    const errors = [];
    const {name, username, email, password, confirm_password} = req.body;
    if (password != confirm_password){
        errors.push({text: 'Las contraseñas no coinciden'})
    }
    if (password.length < 4) {
        errors.push({text: 'La contraseña debe tener al menos 4 caracteres'})
    }
    if (errors.length > 0) {
        res.render('signup', {
            name,
            username,
            email,
            errors,
        })
        console.log(name)
    } else {
        const emailUser= await User.findOne({email: email});
        if (emailUser) {
            errors.push({text: 'El correo ya esta en uso'})
            //req.flash('error_msg', 'El correo ya esta en uso')
            //res.redirect('/signup')
            res.render('signup', {
                name,
                username,
                email,
                errors,
            })
        } else {
            const newuser= new User({name, username, email, password})
            newuser.password = await newuser.encryptPassword(password);
            await newuser.save();
            const success_msg = "¡El usuario se a creado exitosamente!"
            res.render('login', {
                success_msg
            })
        }
    }
};

usersCtrl.renderLoginForm = (req,res) => {
    res.render('login', {
    })
};

usersCtrl.login = passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: '/inicio',
    failureFlash: true
});

usersCtrl.logout = (req, res) =>{
    req.logout(req.user, err => {
        if(err) return next(err);
        req.flash('success_msg','Se ha cerrado la session');
        res.redirect('/');
      });
};



module.exports = usersCtrl;