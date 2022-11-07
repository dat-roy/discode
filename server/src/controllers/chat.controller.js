const UserRoom = require('../models/user_room.model')
const Room = require('../models/room.model')
const { RoomTypes } = require('../types/db.type')

class chatController {
    //[GET] /api/chat/get/room/:id
    async getRoomByID(req, res, next) {
        const room_id = req.params.id;
        try {
            const room_data = await Room.findOne({
                where: {
                    id: room_id,
                }
            })
            if (!room_data) {
                return res.status(200).json({
                    message: "Empty result"
                })
            }
            res.status(200).json(room_data);
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error",
            })
        }
    }

    //[POST] /api/chat/get/joined/single-rooms
    async getJoinedRooms(req, res, next) {
        const { user_id } = req.body;

        try {
            const single_room_list = await UserRoom.getSingleRoomsByUserID({
                user_id: user_id,
            })
            return res.status(200).json({
                message: "Get joined rooms successfully",
                room_list: single_room_list,
            })
        } catch (err) {
            console.log(err.message);
            res.status(500).json({
                message: "Internal Server Error", 
                error: err.message,
            })
        }
    }

    //[POST] /api/chat/get/common/single-rooms
    async getCommonSingleRooms(req, res, next) {
        //Note: `my_id`, `other_id` are guaranteed to be valid.
        let {my_id, other_id} = req.body;

        try {
            const my_single_rooms = await UserRoom.getSingleRoomsByUserID({
                user_id: my_id,
            })

            if (!my_single_rooms || my_single_rooms.length === 0) {
                return res.status(200).json({
                    message: "No room found", 
                    //common_room: [], 
                })
            } 

            const common_room = []
            for (const room of my_single_rooms) {
                const result = await UserRoom.findOne({
                    where: 
                        `user_id=${other_id} AND room_id=${room.room_id}`, 
                })
                if (result) {
                    common_room.push(room);
                }
            }

            if (common_room.length === 0) {
                return res.status(200).json({
                    message: "There's no common room", 
                    //common_room: [], 
                })
            } else {
                return res.status(200).json({
                    message: "Get common single rooms successfully", 
                    note: "common_room is expected to have only one element", 
                    common_room: common_room, 
                })
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error", 
                error: err.message, 
            })
        }
    }

    //[POST] /api/chat/create/single-room 
    async createNewSingleRoom(req, res, next) {
        const { my_id, other_id } = req.body;
        const type = RoomTypes.SINGLE;
        const channel_id = null;
        const title = null;
        const removable = false;

        try {
            if (my_id === other_id) {
                throw new Error("Same user id")
            }
            const result = await Room.create({
                channel_id: channel_id, 
                type: type, 
                title: title, 
                removable: removable, 
            })
            if (result.affectedRows === 0) {
                throw new Error("DB server error: no row affected");
            } else {
                //Create two user_room record.
                const room_id = result.insertId;
                const savingMyID = await UserRoom.create({
                    user_id: my_id, 
                    room_id: room_id, 
                })

                const savingOtherID = await UserRoom.create({
                    user_id: other_id, 
                    room_id: room_id, 
                })

                if (!savingMyID.affectedRows || !savingOtherID.affectedRows) {
                    throw new Error("DB server error: no row affected")
                } else {
                    return res.status(200).json({
                        message: "Create a new single room successfully", 
                        room_data:[{
                            room_id: room_id,
                            title: title, 
                            channel_id: channel_id, 
                            type: type, 
                            removable: removable, 
                        }]
                    })
                }
            }
        } catch(err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }
}

module.exports = new chatController();