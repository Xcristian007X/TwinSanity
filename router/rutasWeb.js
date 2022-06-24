const { Router } =require('express')
const router = Router();

//modelo de base de datos
const Foro = require('../models/foro')
const Comentario = require('../models/comentario')

//login, revisar ControlUser que es la funcionalidad///////////////////////////////////////////////////////////////////////////////
const {renderSignUpForm, renderLoginForm, signup, login, logout} = require('../controllers/controlUsers')

router.get("/signup", renderSignUpForm);

router.post("/signup", signup);

router.get("/login", renderLoginForm);

router.post("/login", login);

router.get("/logout", logout);

/////////////////////////////////////////////////////////////////////////////////////
router.get("/", async (req, res) => {
    try{
        const arrayForosDB = await Foro.find();
        //console.log(arrayForosDB)
        res.render("index", {
            titulo : "TwinSanity",
            arrayForos: arrayForosDB,
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

//router.get("/login", (req, res) => {

//    try{
//        res.render("login",{titulo : "Iniciar Sesion"});
//    } catch (error) {
//        console.log(error)
//    }
//  })

router.get("/prueba", (req, res) => {
    res.render("prueba");
})
  
router.get("/about", (req, res) => {
    res.render("about",{titulo : "Quienes Somos"});
})
  
router.get("/contact", (req, res) => {
    res.render("contact",{titulo : "Contactanos"});
})
 

router.get("/:room", (req, res) => {
    res.render("room",{titulo : "Contactanos", roomId: req.params.room})
})

module.exports = router;

