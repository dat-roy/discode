const Channels = require('../models/channels.model')
const Users = require('../models/users.model');
const UserChannel = require('../models/user_channel.model');
const UserRoom = require('../models/user_room.model')
const Rooms = require('../models/rooms.model')

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
        let { user_id, title, description, avatar_url } = req.body;
        if (!title || title === '') {
            return res.status(200).json({
                message: "Empty title of channel",
                results: null,
            })
        }

        try {
            const checkUserIdExists = await Users.checkExistence({ where: { id: user_id } });
            if (!checkUserIdExists) {
                return res.status(404).json({
                    message: "Can not find user ID",
                })
            } else {
                const result = await Channels.create({
                    admin_id: user_id,
                    title: title,
                    description: description,
                    avatar_url: avatar_url,
                });

                //console.log(result);
                return res.status(200).json({
                    message: "Create new channel successfully",
                    results: result,
                })
            }
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                message: "An internal error from server",
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
    }

    //[POST] /api/channel/add-member
    async addMember(req, res, next) {
        /*  Request body: 
                + admin_id.
                + req_id: ID of user who sent a joining request.
                + channel_id.
            Steps:
                + Check valid.
                + Check admin group.
                + Check member already in conv.
                + Add member.
        */
        let { admin_id, req_id, channel_id } = req.body;

        try {
            const checkAdminIdExists = await Users.checkExistence({ where: { id: admin_id } });
            const checkReqIdExists = await Users.checkExistence({ where: { id: req_id } });
            const checkChannelIdExists = await Channels.checkExistence({ where: { id: channel_id } });

            // check valid
            if (!checkAdminIdExists) {
                return res.status(404).json({
                    message: "Can not detect Admin ID"
                })
            }
            if (!checkReqIdExists) {
                return res.status(404).json({
                    message: "Can not detect Request ID"
                })
            }
            if (!checkChannelIdExists) {
                return res.status(404).json({
                    message: "Can not detect Channel ID"
                })
            }

            //check authenticate
            const authenAdminId = await Channels.findOne({
                where:
                    `id = ${channel_id} AND admin_id = ${admin_id}`
            })

            if (!authenAdminId) {
                return res.status(404).json({
                    message: "ID is not Admin",
                })
            }

            //Check request in conversation
            const checkRequestIdInChannel = await UserChannel.checkExistence({
                where:
                    `channel_id = ${channel_id} AND user_id = ${req_id}`,
            })

            if (checkRequestIdInChannel) {
                return res.status(404).json({
                    message: "Request ID is already in this channel",
                })
            } else {
                //Add member to channel
                const result = await UserChannel.create({
                    user_id: req_id,
                    channel_id: channel_id,
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
                message: "An internal error from server",
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
}

module.exports = new channelController();