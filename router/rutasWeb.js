const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User= require('../models/user')
const passport= require('../config/passport')
//modelo de base de datos
const Foro = require('../models/foro')
const Comentario = require('../models/comentario')

//login, revisar ControlUser que es la funcionalidad///////////////////////////////////////////////////////////////////////////////
const {renderSignUpForm, renderLoginForm, signup, login, logout} = require('../controllers/controlUsers')

router.get("/signup", renderSignUpForm);

router.post("/signup", signup);

router.get("/", renderLoginForm);

router.post("/", login);

router.get("/logout", logout);

/////////////////////////////////////////////////////////////////////////////////////
router.get("/inicio", async (req, res) => {
    try{
        const error = "";
        const success = "";
        //Verifica si el usuario esta logeado o no////////////////////////////////////
        if(!res.locals.user) {
            res.status(401);
            res.render('login', {
                error: 'Se necesita haber iniciado sesion para ver el contenido'
            })
            res.end('no autorizado');
        } else {
        const arrayForosDB = await Foro.find();
        //console.log(arrayForosDB)
        res.render("index", {
            titulo : "TwinSanity",
            arrayForos: arrayForosDB,
            user: res.locals.user.username
        })}
    } catch (error) {
        console.log(error)
    }
  })

  router.get("/foro/:id", async (req,res) => {
      const id = req.params.id
      try{
        const error = "";
        const success = "";
        if(!res.locals.user) {
            res.status(401);
            res.render('login', {
                success,
                error: 'Se necesita haber iniciado sesion para ver el contenido'
            })
            res.end('no autorizado');
        } else {
        const ForosDB = await Foro.findOne({_id: id})
        const arrayComentarioDB = await Comentario.find({id2: id});
        res.render('detalle', {
            comentario: arrayComentarioDB,
            foro: ForosDB,
            error: false,
            user: res.locals.user.username
        })}
      } catch (error){
          res.render('detalle', {
            error: true,
            user: res.locals.user.username,
            mensaje: 'No se encuentra el foro'
        })
      }
  })

router.post("/foro/:id", async(req, res) => {
    const id = req.params.id
    const body = req.body
    try {
        await Comentario.create(body)
        res.redirect("/foro/"+id)
    } catch (error){
        console.log(error)
    }
   
})

router.delete('/foro/:id/delete', async(req, res) => {
    const id = req.params.id
    try {
        await Foro.findByIdAndDelete(id)
        res.redirect('/inicio')
    } catch (error){
        console.log(error)
    }
})

router.delete('/foro/:id/comentario/:id2/delete', async(req, res) => {
    const id = req.params.id
    const id2= req.params.id2
    try {
        await Comentario.findByIdAndDelete(id2)
        res.redirect("/foro/"+id)
    } catch (error){
        console.log(error)
    }
})

router.post('/inicio', async(req, res) => {
    const body = req.body
    try {
        await Foro.create(body)
        res.redirect('/inicio')
    } catch (error){
        console.log(error)
    }
   
})

//Archivo pruebas tecnicas
router.get("/prueba", (req, res) => {
    res.render("prueba",{titulo : "Iniciar Sesion"});
});


//Extras

router.get("/about", (req, res) => {
    res.render("about",{titulo : "Quienes Somos", user: res.locals.user.username});
});
  


//VideoChat

router.get("/:room", (req, res) => {
    res.render("room",{
        titulo : "VideoChat",
        roomId: req.params.room,
        user: res.locals.user.username
    });
});



module.exports = router;