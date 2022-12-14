const path = require('path')
const Rooms = require('../models/rooms.model')
const Users = require('../models/users.model')
const UserRoom = require('../models/user_room.model')
const Messages = require('../models/messages.model')
const MessageRecipients = require('../models/message_recipients.model')
const MessageAttachments = require('../models/message_attachments.model')
const { MessageTypes } = require('../types/db.type')
const { formatMediaURL } = require('../utils/formatters/url-formatter')

class messageController {
    //[POST] /api/message/get/old
    //Deprecated
    async getOldMessages(req, res, next) {
        const { user_id, room_id } = req.body;

        try {
            //check if room_id exists or not.
            const checkRoomIdExists = await Rooms.checkExistence({ where: { id: room_id } });
            //check if user_id exists or not.    
            const checkUserIdExists = await Users.checkExistence({ where: { id: user_id } });

            if (!checkRoomIdExists) {
                return res.status(404).json({
                    message: "Room not found",
                })
            }
            if (!checkUserIdExists) {
                return res.status(404).json({
                    message: "User not found",
                })
            }

            if (checkRoomIdExists && checkUserIdExists) {
                //check if user_id joined room_id or not.
                const userRoomId = await UserRoom.findOne({
                    where: `user_id=${user_id} AND room_id=${room_id}`,
                })

                if (!userRoomId) {
                    return res.status(404).json({
                        message: "User does not join this room",
                    })
                } else {
                    //find all messages_id 
                    const allMessagesID = await MessageRecipients.findAll({
                        attributes: [
                            "message_id",
                        ],
                        where:
                            `recipient_id = ${user_id} AND recipient_room_id = ${userRoomId.id}`,
                    })

                    const allMessages = []
                    for (const messageID of allMessagesID) {
                        const message = await Messages.findOneWithSenderData({
                            msg_id: messageID.message_id,
                        })
                        if (message) {
                            message.message_attachments = null;
                            if (message.message_type == MessageTypes.IMAGE) {
                                const attachment = await MessageAttachments.findOne({
                                    where: {
                                        message_id: messageID.message_id,
                                    }
                                })
                                message.message_attachments = formatMediaURL(
                                    attachment?.attachment_content
                                );
                            }
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

    //[POST] /api/message/get/old/with-offset
    async getOldMessagesWithOffset(req, res, next) {
        const { user_id, room_id, offset } = req.body;
        try {
            //check if room_id exists or not.
            const checkRoomIdExists = await Rooms.checkExistence({ where: { id: room_id } });
            //check if user_id exists or not.    
            const checkUserIdExists = await Users.checkExistence({ where: { id: user_id } });
            if (!checkRoomIdExists) {
                return res.status(404).json({
                    message: "Room not found",
                })
            }
            if (!checkUserIdExists) {
                return res.status(404).json({
                    message: "User not found",
                })
            }
            if (checkRoomIdExists && checkUserIdExists) {
                //check if user_id joined room_id or not.
                const userRoomId = await UserRoom.findOne({
                    where: `user_id=${user_id} AND room_id=${room_id}`,
                })

                if (!userRoomId) {
                    return res.status(404).json({
                        message: "User does not join this room",
                    })
                } else {
                    //find all messages_id < offset
                    const offset_str = (offset) ? `AND message_id < ${offset} ` : ``;

                    const allMessagesID = await MessageRecipients.findAll({
                        attributes: ['message_id'],
                        where:
                            `recipient_id = ${user_id} AND recipient_room_id = ${userRoomId.id} `
                            + offset_str
                            + `ORDER BY message_id DESC LIMIT 20`,
                    })

                    const allMessages = []
                    for (const messageID of allMessagesID) {
                        const message = await Messages.findOneWithSenderData({
                            msg_id: messageID.message_id,
                        })
                        if (message) {
                            message.message_attachments = null;
                            if (message.message_type == MessageTypes.IMAGE) {
                                const attachment = await MessageAttachments.findOne({
                                    where: {
                                        message_id: messageID.message_id,
                                    }
                                })
                                message.message_attachments = formatMediaURL(
                                    attachment?.attachment_content
                                );
                            }
                            allMessages.push(message);
                        }
                    }
                    res.status(200).json({
                        message: "Get all messages successfully",
                        messages: allMessages.reverse(),
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

    //[POST] /api/message/mark/read
    async markMessagesAsRead(req, res, next) {
        const { user_id, room_id } = req.body;

        try {
            const userRoomId =
                (await UserRoom.findOne({
                    where:
                        `user_id=${user_id} AND room_id=${room_id}`,
                })).id

            const result = await MessageRecipients.markAsReadForAll({
                recipient_id: user_id,
                recipient_room_id: userRoomId,
            })

            return res.status(200).json({
                message: "Success",
                result,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }

    //[GET] /api/message/count/all/unread/?user_id=&type=
    async countAllUnreadMessages(req, res, next) {
        const user_id = parseInt(req.query.user_id);
        const type = req.query.type;
        if (!user_id) {
            return res.status(400).json({
                message: "Empty user_id",
            })
        }
        try {
            const result = await UserRoom.getSingleRoomsByUserID({ user_id });

            let total = 0;
            for (const recipientRoom of result) {
                total += await MessageRecipients.countUnread({
                    recipient_room_id: recipientRoom.id
                });
            }
            res.status(200).json({
                message: "Success",
                result,
                unread: total,
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }

    //[POST] /api/message/save
    async saveNewMessage(req, res, next) {
        //TODO:
        // + check if sender_id, room_id exist or not.
        // + check if sender_id is in room or not.
        // + check if parent_message_id exists or not. (if not null)
        // + check if message_type is valid or not.

        const {
            sender_id, room_id, content, parent_message_id,
        } = JSON.parse(req.body.document);

        const message_type = (req.file) ? MessageTypes.IMAGE : MessageTypes.TEXT;
        const file_path = (req.file) ? path.join('upload', 'msg', req.file.filename) : null;
        //console.log(file_path);

        try {

            //Check recipients existence.
            const recipientsList = await UserRoom.findAll({ where: { room_id: room_id } })

            if (!recipientsList || recipientsList.length === 0) {
                throw new Error("DB error: No recipient found");
            } else {
                //Save new message
                const messagesSaving = await Messages.create({
                    sender_id: sender_id,
                    content: content,
                    message_type: message_type,
                    parent_message_id: parent_message_id,
                })
                if (messagesSaving.affectedRows === 0) {
                    throw new Error("DB error: No row affected");
                }

                //Save message attachment if message types != TEXT
                if (req.file && message_type === MessageTypes.IMAGE) {
                    const attachmentSaving = await MessageAttachments.create({
                        message_id: messagesSaving.insertId,
                        attachment_content: file_path,
                    })
                    if (attachmentSaving.affectedRows === 0) {
                        throw new Error("DB error: No row affected");
                    }
                }

                //Insert records to all recipients (include sender) 
                //is_read = true (if be sender), false (otherwise)
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

                //Fetch new message data
                const message = await Messages.findOneWithSenderData({
                    msg_id: messagesSaving.insertId,
                })
                if (message) {
                    message.message_attachments = null;
                    if (message.message_type == MessageTypes.IMAGE) {
                        const messageAttachmentResult = await MessageAttachments.findOne({
                            where: {
                                message_id: messagesSaving.insertId,
                            }
                        })
                        message.message_attachments = formatMediaURL(messageAttachmentResult?.attachment_content);
                    }
                }

                return res.status(200).json({
                    message: "Save new message successfully",
                    msg_data: message,
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
}

module.exports = new messageController();