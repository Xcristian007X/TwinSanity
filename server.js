const express = require("express");
const bodyParser = require('body-parser')
const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


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
