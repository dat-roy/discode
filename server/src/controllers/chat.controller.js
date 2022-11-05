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
            const rows = await UserRoom.findAll({
                where: {
                    user_id: user_id,
                }
            })
            if (!rows || rows.length === 0) {
                return res.status(200).json({
                    message: "No room found",
                    room_list: [],
                })
            }

            const room_list = [];
            for (const row of rows) {
                const room = await Room.findOne({
                    where: 
                        `id=${row.room_id} AND type=${RoomTypes.SINGLE}`,
                }) 
                
                if (!room || room.length === 0) {
                    throw new Error("Database server error");
                }
                room_list.push(room);
            }

            return res.status(200).json({
                message: "Get joined rooms successfully",
                room_list: room_list,
            })
        } catch (err) {
            console.log(err.message);
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }
}

module.exports = new chatController();