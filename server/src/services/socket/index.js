/*
 * Handle events when having any client connection.
 */

const onlineUsers = []

const socketHandler = (io, socket) => {
    console.log("New client connected: " + socket.id);
    !onlineUsers.includes({socketid: socket.id}) && onlineUsers.push({socketid: socket.id})

    //console.log("Online Users: ")
    //console.log(onlineUsers);

    socket.on("joinChatRoom", (room_id) => {
        socket.join(room_id);
    })

    socket.on("sendChatMessage", (message, room_id) => {
        //io.in(room_id).emit("sendDataServer", message);
        socket.broadcast.to(room_id).emit("receiveChatMessage", message);
        //console.log(message);
        //console.log("Room_id: " + room_id);
        //console.log("Members: " + io.sockets.adapter.rooms.get(room_id).size)
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        //socket.removeAllListeners();
    })
}

module.exports = socketHandler;