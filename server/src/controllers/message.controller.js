const Room = require('../models/room.model')
const Users = require('../models/users.model')
const UserRoom = require('../models/user_room.model')
const Messages = require('../models/messages.model')
const MessageRecipients = require('../models/message_recipients.model')

class messageController {
    //[POST] /api/message/get/old
    async getOldMessages(req, res, next) {
        const { user_id, room_id } = req.body;

        try {
            //check if room_id exists or not.
            const checkRoomIdExists = await Room.checkExistence({ where: { id: room_id } });
            //check if user_id exists or not.    
            const checkUserIdExists = await Users.checkExistence({ where: { id: user_id } });

            if (!checkRoomIdExists) {
                return res.status(200).json({
                    message: "Room not found",
                })
            }
            if (!checkUserIdExists) {
                return res.status(200).json({
                    message: "User not found",
                })
            } 
            
            if (checkRoomIdExists && checkUserIdExists) {
                //check if user_id joined room_id or not.
                const userRoomId = await UserRoom.findOne({
                    where: `user_id=${user_id} AND room_id=${room_id}`,
                })

                if (!userRoomId) {
                    return res.status(200).json({
                        message: "User does not join this room",
                    })
                } else {
                    //console.log(userRoomId);
                    const allMessagesID = await MessageRecipients.findAll({
                        attributes: [
                            "message_id",
                        ],
                        where:
                            `recipient_id = ${user_id} AND recipient_room_id = ${userRoomId.id}`,
                    })

                    const allMessages = []
                    for (const messageID of allMessagesID) {
                        const message = await Messages.findOne({
                            where: {
                                id: messageID.message_id,
                            }
                        })
                        if (message) {
                            allMessages.push(message);
                        }
                    }

                    res.status(200).json({
                        message: "Get all messages successfully",
                        messages: allMessages,
                    })
                }
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }

    //[POST] /api/message/save
    async saveNewMessage(req, res, next) {
        const {
            sender_id, room_id, content, message_type, parent_message_id,
        } = req.body;

        //TODO:
        // + check if sender_id, room_id exist or not.
        // + check if sender_id is in room or not.
        // + check if parent_message_id exists or not. (if not null)
        // + check if message_type is valid or not.

        try {
            //Save to database:
            //Save `messages`
            //Find all user_room -> save `message_recipient` (including sender);

            const messagesSaving = await Messages.create({
                sender_id: sender_id,
                content: content,
                message_type: message_type,
                parent_message_id: parent_message_id,
            })

            const recipientsList = await UserRoom.findAll({
                where: {
                    room_id: room_id,
                }
            })

            if (messagesSaving.affectedRows === 0) {
                throw new Error("DB error: No row affected");
            }
            if (!recipientsList || recipientsList.length === 0) {
                throw new Error("DB error: No recipient found");
            }

            for (const recipient of recipientsList) {
                const is_read = (recipient.user_id === sender_id) ? true : false;
                const messageRecipientsSaving = await MessageRecipients.create({
                    recipient_id: recipient.user_id,
                    recipient_room_id: recipient.id,
                    message_id: messagesSaving.insertId,
                    is_read: is_read,
                })
                if (messageRecipientsSaving.affectedRows === 0) {
                    throw new Error("DB error: No row affected")
                }
            }

            return res.status(200).json({
                message: "Save new message successfully",
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }
}

module.exports = new messageController();