const path = require('path')
const Channels = require('../models/channels.model')
const Users = require('../models/users.model');
const UserChannel = require('../models/user_channel.model');
const UserRoom = require('../models/user_room.model')
const Rooms = require('../models/rooms.model')
const Notifications = require('../models/notifications.model')
const NotificationReceivers = require('../models/notification_receivers.model')
const { RoomTypes, ChannelNotificationTypes } = require('../types/db.type');
const { formatMediaURL } = require('../utils/formatters/url-formatter');

class channelController {
    //[GET] /api/channel/:id?user_id=
    async getChannelById(req, res, next) {
        const channel_id = parseInt(req.params.id);
        const user_id = parseInt(req.query.user_id);
        try {
            const channelData = await Channels.findOne({
                where: {
                    id: channel_id,
                }
            })
            const joined = isNaN(user_id)
                ? false
                : await UserChannel.checkExistence({
                    where:
                        `user_id=${user_id} AND channel_id=${channel_id}`,
                })
            channelData.avatar_url = formatMediaURL(channelData.avatar_url);
            channelData.background_url = formatMediaURL(channelData.background_url);

            return res.status(200).json({
                message: "Get channel successfully",
                channel: channelData,
                joined: joined,
                user_id: user_id,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }

    //[POST] /api/channel/create
    async createChannel(req, res, next) {
        const {
            admin_id,
            title, description,
        } = JSON.parse(req.body.document);

        const avatar_path = path.join('upload', 'channel',
            req.files['avatar'][0].filename);
        const background_path = path.join('upload', 'channel',
            req.files['background'][0].filename);

        if (!title || title === '') {
            //TODO: remove all images.
            return res.status(400).json({
                message: "Empty title of channel",
            })
        }

        try {
            const checkUserIdExists = await Users.checkExistence({ where: { id: admin_id } });
            if (!checkUserIdExists) {
                //TODO: remove all images.
                return res.status(404).json({
                    message: "Can not find user ID",
                })
            } else {
                const result = await Channels.create({
                    admin_id,
                    title, description,
                    avatar_url: avatar_path,
                    background_url: background_path,
                });

                if (result.affectedRows === 0) {
                    throw new Error("DB error");
                }

                //Save in user_channel.
                const userChannelSaving = await UserChannel.create({
                    user_id: admin_id,
                    channel_id: result.insertId,
                })

                if (userChannelSaving.affectedRows === 0) {
                    throw new Error("DB error")
                } else {
                    return res.status(200).json({
                        message: "Create new channel successfully",
                        channel_id: result.insertId,
                    })
                }
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
            })
        }
    }

    //[POST] /api/channel/remove
    async deleteChannel(req, res, next) {
        let { user_id, channel_id } = req.body;

        try {
            const checkUserIdExists = await Users.checkExistence({ where: { id: user_id } });
            const checkChannelExists = await Channels.checkExistence({ where: { id: channel_id } });
            if (!checkUserIdExists) {
                return res.status(404).json({
                    message: "Can not detect User Id",
                })
            }
            if (!checkChannelExists) {
                return res.status(404).json({
                    message: "Can not find channel ID",
                })
            }

            const result = await Channels.delete({
                admin_id: user_id,
                channel_id: channel_id,
            });

            if (result.affectedRows == 0) {
                return res.status(404).json({
                    message: "No row affected. This user_id has no rights"
                })
            }
            res.status(200).json({
                message: "Delete channel successfully",
                results: result,
            })
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                message: "An internal error from server",
            })
        }
    }

    //[POST] /api/channel/invite
    async inviteMember(req, res, next) {
        const { sender_id, receiver_id, channel_id } = req.body
        try {
            //TODO: check sender_id, receiver_id existence & joined channel or not.

            //if already invite -> nothing to do.
            //else: create a noti.
            const invitationExists = await NotificationReceivers.checkChannelNotiSent({
                sender_id, receiver_id, channel_id,
                noti_type: ChannelNotificationTypes.CHANNEL_INVITE,
            })
            if (invitationExists) {
                return res.status(200).json({
                    exist: true,
                    message: "Pending",
                })
            } else {
                const notifiable_id =
                    (await UserChannel.findOne({
                        attributes: [`notifiable_id`],
                        where: {
                            user_id: sender_id,
                            channel_id,
                        }
                    })).notifiable_id;

                const notification_id =
                    (await Notifications.create({
                        notifiable_id,
                        type: ChannelNotificationTypes.CHANNEL_INVITE,
                    })).insertId;

                const noti_receiver_id =
                    (await NotificationReceivers.create({
                        notification_id, receiver_id,
                    })).insertId;
                return res.status(200).json({
                    exist: false,
                    message: "Invitation sent",
                    noti_receiver_id,
                })
            }
        } catch (err) {
            console.log(err);
            return res.status(err.message);
        }
    }

    //[POST] /api/channel/invite/reply
    async replyInvitation(req, res, next) {
        const { user_id, channel_id, noti_id, accept } = req.body;

        try {
            const marked = await NotificationReceivers.markOneAsRead({
                user_id, noti_id,
            })
            if (marked) {
                if (accept) {
                    //Add new member.
                    await UserChannel.create({
                        user_id, channel_id,
                    })
                    //Create an accepted notifications...
                    const admin_id =
                        (await Channels.findOne({
                            attributes: [`admin_id`],
                            where: { id: channel_id },
                        }))?.admin_id;

                    const notifiable_id =
                        (await UserChannel.findOne({
                            attributes: [`notifiable_id`],
                            where: {
                                user_id: admin_id,
                                channel_id,
                            }
                        }))?.notifiable_id;

                    const new_noti = await Notifications.create({
                        notifiable_id,
                        type: ChannelNotificationTypes.CHANNEL_ACCEPTED,
                    })
                    return res.status(200).json({
                        message: "Success",
                        new_noti,
                    })
                } else {
                    return res.status(200).json({
                        message: "Success",
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

    //[POST] /api/channel/request/reply
    async replyJoiningRequest(req, res, next) {
        const { admin_id, user_id, channel_id, accepted } = req.body;
        try {
            if (accepted) {
                //Add a new member.
                await UserChannel.create({
                    user_id, channel_id,
                })
                //Create an accepted notifications...

                return res.status(200).json({
                    message: "Add new member successfully",
                })
            } else {
                //Create a declined notifications...
                const notifiable_id =
                    (await UserChannel.findOne({
                        attributes: [`notifiable_id`],
                        where: {
                            user_id: admin_id,
                            channel_id,
                        }
                    }))?.notifiable_id;
                const noti_id = await Notifications.create({
                    notifiable_id,
                    type: ChannelNotificationTypes.CHANNEL_DECLINED,
                })
                return res.status(200).json({
                    message: "Sent declined noti successfully",
                    noti_id,
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

    //[POST] /api/channel/add-member
    async addMember(req, res, next) {
        /*  Request body: 
                + user_id: ID of user who sent a joining request.
                + channel_id.
            Steps:
                + Check valid.
                + Check member already in channel.
                + Add member.
        */
        let { user_id, channel_id } = req.body;

        try {
            const checkUserIdExists = await Users.checkExistence({ where: { id: user_id } });
            const checkChannelIdExists = await Channels.checkExistence({ where: { id: channel_id } });

            // check valid
            if (!checkUserIdExists) {
                return res.status(404).json({
                    message: "Can not detect User ID"
                })
            }
            if (!checkChannelIdExists) {
                return res.status(404).json({
                    message: "Can not detect Channel ID"
                })
            }

            //Check if user is already in channel or not.
            const userExists = await UserChannel.checkExistence({
                where:
                    `channel_id = ${channel_id} AND user_id = ${user_id}`,
            })

            if (userExists) {
                return res.status(404).json({
                    message: "Request ID is already in this channel",
                })
            } else {
                //Add member to channel
                const result = await UserChannel.create({
                    user_id, channel_id,
                });

                if (result.affectedRows === 0) {
                    throw new Error("Database server error")
                }
                return res.status(200).json({
                    message: "Add member successfully",
                    result: result,
                })
            }
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message,
            })
        }
    }

    //[POST] /api/channel/remove-member
    async deleteMember(req, res, next) {
        //Request body: admin_id, deleted_id, channel_id

        //Steps:
        //+ check if admin_id & deleted_id & channel_id are valid or not.
        //+ if admin_id === deleted_id --> invalid.
        //+ check if admin_id has admin role in channel.
        //+ check deleted_id exists in conversation or not.

        let { admin_id, deleted_id, channel_id } = req.body;
        try {
            const checkAdminIdExists = await Users.checkExistence({ where: { id: admin_id } });
            const checkDeletedIdIdExists = await Users.checkExistence({ where: { id: deleted_id } });
            const checkChannelIdExists = await Channels.checkExistence({ where: { id: channel_id } });

            if (!checkAdminIdExists) {
                return res.status(404).json({
                    message: "Can not detect AdminID"
                })
            } else if (!checkDeletedIdIdExists) {
                return res.status(404).json({
                    message: "Can not detect deleteID"
                })
            } else if (!checkChannelIdExists) {
                return res.status(404).json({
                    message: "Can not detect ChannelID"
                })
            } else {
                const adminIdAuth = await Channels.checkExistence({
                    where:
                        `id=${channel_id} AND admin_id=${admin_id}`,
                })

                if (!adminIdAuth) {
                    return res.status(404).json({
                        message: "User is not an admin of channel",
                    })
                } else {
                    const checkDeletedIdInChannel = await UserChannel.checkExistence({
                        where:
                            `user_id=${deleted_id} AND channel_id=${channel_id}`,
                    })

                    if (!checkDeletedIdInChannel) {
                        return res.status(404).json({
                            message: "UserID to delete doesn't exist in this channel",
                        })
                    } else {
                        const result = await UserChannel.delete({
                            deleted_id: deleted_id,
                            channel_id: channel_id,
                        });

                        if (result.affectedRows === 0) {
                            return res.status(404).json({
                                message: "No row affected."
                            })
                        }
                        return res.status(200).json({
                            message: "Delete a member from channel successfully",
                            result: result
                        });
                    }
                }
            }
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                message: "An internal error from server",
            })
        }
    }

    //[POST] /api/channel/get/members
    async getMembers(req, res, next) {
        const channel_id = parseInt(req.body.channel_id);
        try {
            const members = await UserChannel.getMembers({ channel_id })
            return res.status(200).json({
                message: "Success",
                members,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }

    //[POST] /api/channel/get/joined-channels
    async getJoinedChannels(req, res, next) {
        const member_id = parseInt(req.body.user_id);
        try {
            const result = await UserChannel.getChannelByMemberId({ member_id });
            return res.status(200).json({
                message: "Get all joined channels successfully",
                joined_channels: result,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }

    //[POST] /api/channel/get/rooms
    async getGroupRooms(req, res, next) {
        const user_id = parseInt(req.body.user_id)
        const channel_id = parseInt(req.body.channel_id)

        //TODO: 
        // + Check if user joined channel or not. 
        try {
            const rooms = await UserRoom.getGroupRooms({
                user_id, channel_id,
            })
            return res.status(200).json({
                rooms,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                error: err.message,
            })
        }
    }

    //[POST] /api/channel/create/room
    async createGroupRoom(req, res, next) {
        const { channel_id, admin_id, room_name } = req.body;
        try {
            //TODO: Check admin id.
            //Check room name exist.
            const roomCheck = await Rooms.checkExistence({
                where:
                    `channel_id=${channel_id} AND type='${RoomTypes.GROUP}' AND title='${room_name}'`,
            })
            if (roomCheck) {
                return res.status(200).json({
                    exist: roomCheck,
                    message: "Duplicate room name error!",
                })
            } else {
                //Saving
                const roomSaving = await Rooms.create({
                    type: RoomTypes.GROUP,
                    channel_id,
                    title: room_name,
                    removable: 1,
                })
                if (roomSaving.affectedRows === 0) {
                    throw new Error("DB error")
                }

                const userRoomSaving = await UserRoom.create({
                    user_id: admin_id,
                    room_id: roomSaving.insertId,
                })

                if (userRoomSaving.affectedRows === 0) {
                    throw new Error("DB error")
                } else {
                    //Fetch created_at
                    const time =
                        (await Rooms.findOne({
                            attributes: [`created_at`],
                            where: { id: roomSaving.insertId },
                        })).created_at;

                    return res.status(200).json({
                        exist: roomCheck,
                        message: "Saved",
                        new_room: {
                            room_id: roomSaving.insertId,
                            title: room_name,
                            created_at: time,
                            removable: 1,
                            type: RoomTypes.GROUP,
                            admin_id,
                        }
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

    //[GET] /api/channel/get/room/:id 
    async getRoomById(req, res, next) {
        const room_id = parseInt(req.params.id);
        try {
            const room = await Rooms.findOne({
                where: {
                    id: room_id,
                }
            })
            return res.status(200).json({
                message: "Success",
                room,
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                err: err.message,
            })
        }
    }

    //[GET] /api/channel/check/title/:title 
    async checkTitleExistence(req, res, next) {
        const { title } = req.params;
        try {
            const exist = await Channels.checkExistence({ where: { title, } })
            return res.status(200).json({
                exist,
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: "Internal Server Error",
                err: err.message,
            })
        }
    }

    //[GET] /api/channel/get/featured
    async getFeaturedChannels(req, res, next) {
        try {
            const channels = await Channels.getFeaturedChannelsDTB();
            for (const channel of channels) {
                channel.avatar_url = formatMediaURL(channel.avatar_url);
                channel.background_url = formatMediaURL(channel.background_url);
            }
            res.status(200).json({
                message: "Success",
                channels,  
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error",
                err: err.message,
            })
        }
    }
}

module.exports = new channelController();