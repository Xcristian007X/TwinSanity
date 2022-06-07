const express = require('express');
const router = express.Router();
//modelo de base de datos
const Foro = require('../models/foro')
const Comentario = require('../models/comentario')


router.get("/", async (req, res) => {
    try{
        const arrayForosDB = await Foro.find();
        //console.log(arrayForosDB)
        res.render("index", {
            titulo : "TwinSanity",
            arrayForos: arrayForosDB,
            cantidad: 0
        })
    } catch (error) {
        console.log(error)
    }
  })

  router.get("/foro/:id", async (req,res) => {

      const id = req.params.id
      try{
        const ForosDB = await Foro.findOne({_id: id})
        const arrayComentarioDB = await Comentario.find({id2: id});
        res.render('detalle', {
            comentario: arrayComentarioDB,
            foro: ForosDB,
            error: false,
        })
      } catch (error){
          res.render('detalle', {
            error: true,
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

router.post('/', async(req, res) => {
    const body = req.body
    try {
        await Foro.create(body)

        res.redirect('/')
    } catch (error){
        console.log(error)
    }
   
})

router.get("/prueba", (req, res) => {
    res.render("prueba",{titulo : "Iniciar Sesion"});
});

router.get("/login", (req, res) => {
    res.render("login",{titulo : "Iniciar Sesion"});
});
  
router.get("/about", (req, res) => {
    res.render("about",{titulo : "Quienes Somos"});
});
  
router.get("/contact", (req, res) => {
    res.render("contact",{titulo : "Contactanos"});
});
 
router.get("/:room", (req, res) => {
    res.render("room",{titulo : "Contactanos", roomId: req.params.room});
});



module.exports = router;