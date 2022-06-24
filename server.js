const express = require("express");
const bodyParser = require('body-parser');
const app = express();
require('./config/passport');
const flash = require('connect-flash');
const session = require('express-session');1
const passport = require('passport');

//Instancias del Login
//const passport = require('passport');
//const cookieParser = require('cookie-parser')
//const session = require('express-session')
//const PassportLocal = require('passport-local').Strategy;
//app.use(express.urlencoded({extended: true}))
//app.use(cookieParser('mi ultra hiper secreto'))

//app.use(session({
//  secret: 'mi ultra hiper secreto',
//  resave: true,
//  saveUninitialized: true
//}));
//
//app.use(passport.initialize());
//app.use(passport.session());

//passport.use(new PassportLocal(function(username, password, done){
//  if(username=== "codigo" && password === "1234")
//    return (done(null,{id :1, name: "codi"});
//  done(null, false);
//}))


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

//Login//////////////////////////////////////////
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//Variables Globales, solo esta en uso error, hay que probar user//////
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null
  next();
})
/////////////////////////////////////////////////
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");

// Conexion a la Base de Datos
const mongoose = require('mongoose')

const user = 'Cristian_angulo';
const password = 'vjVkBz9rl1lQExfB';
const dbName = "foros";
const uri = `mongodb+srv://${user}:${password}@twinsanity.2ovgpc1.mongodb.net/${dbName}?retryWrites=true&w=majority`;
mongoose.connect(uri,
//mongoose.connect('mongodb://localhost:27017/foros',
  {useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log('Base de datos conectada'))
  .catch(e => console.log(e))


const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');




app.use(express.static( __dirname + "/public"));



//rutas WEB
app.use(require('./router/rutasWeb'));
//app.use(require('./router/rutasUsuario'));

app.get("/room", (req, res) => {
  res.redirect(`/room/${uuidv4()}`);
});


app.use((req, res, next) => {
    res.status(404).render("404", {
        titulo: "404",
        descripccion: "TwinSanity"
    });
});


io.on("connection", (socket) => {

  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });

  socket.on("chat", (msg) => {
    io.emit("chat", msg);
  });

});



server.listen(process.env.PORT || 3000);

module.exports = app;