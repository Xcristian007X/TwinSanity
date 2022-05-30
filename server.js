const express = require('express');
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
app.use("/peerjs", peerServer);

app.use(express.urlencoded({extended:false}));
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));


app.set('view engine', 'ejs');

const bcryptjs = require('bcryptjs');

const session = require('express-session');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

const connection = require('./database/db');
const { connect } = require('./database/db');
const { render } = require('express/lib/response');

//REGISTER SHEET
app.get('/register',(req, res)=>{
    res.render('register.ejs');
});
app.post('/register', async (req, res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8)
    connection.query('INSERT INTO users SET ?', {user:user, name:name, rol:rol, pass:passwordHaash}, async(error, results)=>{
        if(error){
           console.log(error); 
        }else{
            res.render('register',{
                alert: true,
                alertTitle: "Registration",
                alertMessage: "Success!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer:1500,
                ruta: ''
            })
        }
    })
})
//END REGISTER

//LOGIN - AUTH SHEET
app.get('/login',(req, res)=>{
    res.render('login.ejs');
});
app.post('/auth', async (req, res)=>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if(user && pass){
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render('login',{
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o Contraseña Incorrectos",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer:false,
                    ruta: 'login'
                })
            }else{
                req.session.loggedin = true;   
                req.session.name = results[0].name
                res.render('login',{
                    alert: true,
                    alertTitle: "Success",
                    alertMessage: "Success!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer:1500,
                    ruta: ''
                })
            }
        })
    }else{
        res.render('login',{
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Porfavor ingrese usuario y contraseña",
            alertIcon: 'warning',
            showConfirmButton: true,
            timer:false,
            ruta: ''
        })
    }
})
app.get('/',(req, res)=>{
    if(req.session.loggedin){
        res.render('index',{
            login: true,
            name: req.session.name
    });}else{
        res.render('index',{
            login: false,
            name: 'Debe iniciar sesion'
        })
    }
});
//END LOGIN

//LOGOUT - DESTROY SESSION
app.get('/logout', (req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})

app.get('/:room', (req, res)=>{
    if(req.session.loggedin){
        res.render("room", {
            login: req.session.loggedin, 
            name: req.session.name, 
            titulo: 'olakase',
            roomId: req.params.room
        })
    } else{
        res.redirect('/');
    }
    
})

io.on("connection", (socket) => {

    socket.on("chat", (msg) => {
        io.emit("chat", msg);
        console.log(msg);
    });

    socket.on("join-room", (roomId, userId, userName) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, userName);
        });
      });

});

server.listen(process.env.PORT || 3000);
