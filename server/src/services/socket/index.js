/*
 * Handle events when having any client connection.
 */

const UserRoom = require("../../models/user_room.model")

let onlineUsers = []

const addUser = (userId, socketId) => {
    !onlineUsers.some((user) => user.id === userId) &&
        onlineUsers.push({ id: userId, socketId });
}

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
}

const removeUserById = (userId) => {
    onlineUsers = onlineUsers.filter(user => user.id !== userId);
}

const findUser = (userId) => {
    return onlineUsers.find(user => user.id === userId);
};

const socketHandler = (io, socket) => {
    console.log("New client connected: " + socket.id);

    socket.on("subscribe", (userId) => {
        findUser(userId) && removeUserById(userId);
        addUser(userId, socket.id);

        console.log("Online Users: " + onlineUsers.length)
        //console.log(onlineUsers);

        //Find all room_id
        UserRoom.findAll({
            where: {
                user_id: userId, 
            }
        })
            .then((res) => {
                //console.log(res);
                for (const userRoom of res) {
                    socket.broadcast.to(userRoom.room_id).emit("notifyOnline", userId)
                    //console.log(userId, " ", userRoom.room_id)
                }
            })
    })

    socket.on("joinChatRoom", (roomId) => {
        //console.log("Rooms: ")
        //console.log(socket.rooms);
        socket.join(roomId);
    })

    socket.on("requestOnlineUsers", (userIdList) => {
        let result = userIdList.filter(userId => findUser(userId))
        if (result && result.length > 0) {
            socket.emit("receiveOnlineUsers", result);
        }
    })

    socket.on("sendChatMessage", (message, roomId) => {
        io.to(roomId).emit("receiveChatMessage", message);
        //socket.broadcast.to(roomId).emit("receiveChatMessage", message);
        //console.log(message);
        //console.log("Room_id: " + room_id);
        //console.log("Members: " + io.sockets.adapter.rooms.get(room_id).size)
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        //Get user_id by socket.id
        const userData = onlineUsers.find((user) => user.socketId === socket.id);
        const userId = userData.id;

        //Find all room_id
        UserRoom.findAll({
            where: {
                user_id: userId, 
            }
        })
            .then((res) => {
                //console.log(res);
                for (const userRoom of res) {
                    socket.broadcast.to(userRoom.room_id).emit("notifyOffline", userId)
                    //console.log(userId, " ", userRoom.room_id)
                }
            })
        removeUser(socket.id);
    })
}

module.exports = socketHandler;