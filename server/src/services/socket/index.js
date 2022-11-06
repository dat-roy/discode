//Handle event when having any client connection.
const socketHandler = (io, socket) => {
    console.log("New client connected: " + socket.id);

    socket.on("joinRoom", (room_id) => {
        socket.join(room_id);
        //cb(`You have just joined a room at ${room}`)
    })

    socket.on("sendDataClient", (message, room_id) => {
        console.log(message);
        console.log(room_id);
        io.in(room_id).emit("sendDataServer", message);
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    })
}

module.exports = socketHandler;