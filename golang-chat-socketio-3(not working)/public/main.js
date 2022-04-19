const socket = io()

new Vue({
    el: '#chat-app',
    data: {
        message: '',
        messages: []
    },
    created() {
        const vm = this;
        socket.on('chat message', function (msg) {
            vm.messages.push({
                text: msg,
                date: new Date().toLocaleDateString()
            })
        })
    },
    methods: {
        sendMessage() {
            socket.emit('chat message', this.message);
            this.message = '';
        }
    }
});


