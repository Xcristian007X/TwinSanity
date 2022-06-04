const express = require('express');
const router = express.Router();


router.get("/", (req, res) => {
    res.render("login", {titulo : "TwinSanity"});
  })
  
router.get("/prueba", (req, res) => {
    req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1;
    res.send(`hola!: ${req.session.cuenta}`);
    
})

router.get("/inicio", (req, res) => {
    res.render("index",{titulo : "Login"});
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