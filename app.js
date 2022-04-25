const express = require('express')
const path = require('path')
const app = express()

const http = require('http')
const server =  http.createServer(app)

const publicPath = path.resolve(__dirname, 'cliente')

app.use(express.static(publicPath))

const {Server} = require('socket.io')
const io = new Server(server)

io.on('connection', (Socket)=>{

    Socket.on('chat', (msg)=>{
        io.emit('chat', msg)

    })
})

app.get('/', (req, res)=>{

    res.sendFile(`${__dirname}/cliente/inicio.html`)

})

server.listen(3000, ()=> {

    console.log('Servidor corriendo en http://localhost:3000')
})