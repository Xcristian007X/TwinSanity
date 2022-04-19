package main

import (
	"fmt"
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
)

func main() {
	server := socketio.NewServer(nil)

	//sockets
	server.OnConnect("/", func(so socketio.Conn) error {
		fmt.Println("nuevo usuario conectado")
		so.SetContext("")
		so.Join("chat_room")
		return nil
	})

	server.OnEvent("/", "chat message", func(so socketio.Conn, msg string) {
		server.BroadcastToRoom("chat_room", "chat message", msg)
	})

	go server.Serve()

	http.Handle("/socket.io/", server)
	http.Handle("/", http.FileServer(http.Dir("./public")))
	log.Println("Server on port 3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}
