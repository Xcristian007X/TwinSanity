const socket = io("/");





const user = prompt("Enter your name");

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});



socket.on("user-connected", (userId) => {
    connectToNewUser(userId, stream);
  });

peer.on("open", (id) => {
  socket.emit("join-room", id, user);
});


let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");
let crearforo = document.getElementById("crearforo1")

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});




socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${
          userName === user ? "me" : userName
        }</span> </b>
        <span>${message}</span>
    </div>`;
});


document.querySelector("#crearf").addEventListener("click", () => {
  crearforo.classList.remove("crearforo");
  document.querySelector("#crearf").classList.add("crearf_hide");
  //var padre2= document.querySelector("#crearf").parentNode
  //padre2.removeChild(document.querySelector("#crearf"))
});
