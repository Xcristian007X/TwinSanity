let socket = io()
const form = document.querySelector('form')
const input = document.querySelector('input')
let mensajes = document.querySelector('ul')
form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (input.value) {
        socket.emit('chat', input.value)
        input.value = ''
    }
})

socket.on('chat', (msg) => {
    let item = document.createElement('li')
    item.textContent = msg
    mensajes.appendChild(item)
    window.scrollTo(0, document.body.scrollHeight)
})