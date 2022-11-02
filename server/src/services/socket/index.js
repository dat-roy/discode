//Handle event when having any client connection.
const socketHandler = (io, socket) => {
    console.log("New client connected: " + socket.id);

    socket.on("joinRoom", (room, cb) => {
        socket.join(room);
        cb(`You have just joined a room at ${room}`)
    })

    socket.on("sendDataClient", (message, room) => {
        console.log(message);
        console.log(room);
        if (! room) {
            socket.emit("sendDataServer", message);
        } else {
            io.in(room).emit("sendDataServer", message);
        }
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    })
}

module.exports = socketHandler;