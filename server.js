//constantes y requerimientos

const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});




// Conexion a la Base de Datos
const mongoose = require('mongoose')

const pass = 'HOUzT8lr8l8ywPQT';
const dbName = "foros";
const uri = `mongodb+srv://root:${pass}@twinsanity.2ovgpc1.mongodb.net/${dbName}?retryWrites=true&w=majority`;
mongoose.connect(uri,
  {useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log('Base de datos conectada'))
  .catch(e => console.log(e))


// llamado de dependencias

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


app.use("/peerjs", peerServer);
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');


app.use(express.static( __dirname + "/public"));



//rutas WEB
app.use('/', require('./router/rutasWeb'));

app.get("/room", (req, res) => {
  res.redirect(`/room/${uuidv4()}`);
});


app.use((req, res, next) => {
    res.status(404).render("404", {
        titulo: "404",
        descripccion: "TwinSanity"
    });
});


//Funciones para el servidor

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
