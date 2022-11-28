/*
 * Handle events when having any client connection.
 */

// const Users = require("../../models/users.model")
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
    console.log("Client total: " + io.sockets.sockets.size);

    socket.on("subscribe", (userId) => {
        const exist = findUser(userId);
        exist && removeUserById(userId);
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
                for (const userRoom of res) {
                    socket.join(userRoom.room_id);
                    socket.broadcast.to(userRoom.room_id).emit("notifyOnline", userId)
                }
            })
    })

    socket.on("joinChatRoom", (roomId) => {
        socket.join(roomId);
    })

    socket.on("requestOnlineUsers", (userIdList) => {
        let result = userIdList.filter(userId => findUser(userId))
        if (result && result.length > 0) {
            socket.emit("receiveOnlineUsers", result);
        }
    })

    socket.on("sendChatMessage", (message, roomId) => {
        message.room_id = roomId;
        io.to(roomId).emit("receiveChatMessage", message, roomId);
        io.to(roomId).emit("receiveChatMessageAgain", message, roomId);
        io.to(roomId).emit("receiveChatMessageAtMenuBar", message, roomId);
        //console.log("Members: " + io.sockets.adapter.rooms.get(room_id).size)
    })

    socket.on("readMessage", (userId, roomId) => {
        io.to(roomId).emit("seenMessage", userId, roomId);

        //TODO: implement for group chat        
        //Get user data 
        // Users.findOne({
        //     attributes: [
        //         'id', 'username', 'avatar_url',
        //     ],
        //     where: {
        //         id: userId,
        //     }
        // })
        //     .then(user => {
        //         io.to(roomId).emit("seenMessage", user, roomId);
        //     })
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        //Get user_id by socket.id
        const userData = onlineUsers.find((user) => user.socketId === socket.id);
        const userId = userData?.id;

        if (!userId) return;

        //Find all room_id
        UserRoom.findAll({
            where: {
                user_id: userId,
            }
        })
            .then((res) => {
                for (const userRoom of res) {
                    socket.broadcast.to(userRoom.room_id).emit("notifyOffline", userId)
                }
            })
        removeUser(socket.id);
    })
}

module.exports = socketHandler;