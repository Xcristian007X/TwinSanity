const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {

  //Verificacion si existe el correo
  const user= await User.findOne({ email: email})
  const error1= 'El usuario no existe'
  if (!user) {
    return done(null, false, error1)
  }
  //Verificacion si la contraseña existe
  const isMatch = await user.matchPassword(password);
  const error2= 'La contraseña es incorrecta'
  //if (!isMatch)
    //return done(null, false, error2);
  //return done(null, user);
  if (isMatch) {
    return done(null,user);
  }else { 
    return done(null, false, error2);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) =>{
  User.findById(id, (err, user) => {
    done(err, user);
  })
});