//const express = require('express');
//const router = express.Router();

//Codigo no funcional, es lo mismo que cuando se pasan get o post despues del /room: en Rutas Web///////
const { Router } =require('express')
const router = Router();


const {renderSignUpForm, renderLoginForm, signup, login, logout} = require('../controllers/controlUsers')

router.get("/signup", renderSignUpForm);

router.post("/signup", signup);

router.get("/login", renderLoginForm);

router.post("/login", login);

router.get("/logout", logout);

module.exports = router;