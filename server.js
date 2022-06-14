// Requerimientos y Inicializaciones

const express = require("express");
const session = require('express-session');
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const MongoStore = require('connect-mongo');
const http = require("http");
const app = express();
const server = http.Server(app);
const passport = require('passport');
const flash = require("connect-flash");
const methodOverride = require("method-override");

const peerServer = ExpressPeerServer(server, { debug: true});
const io = require("socket.io")(server, {cors: {origin: '*'}});
require('./database');
require('./config/passport');

// Use-Set Applicacion

app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'mysecretapp',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/peerjs", peerServer);
app.use(express.static( __dirname + "/public"));
app.use('/', require('./router/routes'));
app.use('/', require('./router/users'));

app.set("view engine", "ejs");
app.set('views', __dirname + '/views');

//Server Socket.io Funciones

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
  socket.on("chat", (message, userName ) => {
    io.emit("crearmsg", message, userName);
  });
});

//Inicializando server

server.listen(process.env.PORT || 3000);
