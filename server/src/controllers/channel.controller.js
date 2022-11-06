const Channel = require('../models/channels.model')
const Users = require('../models/users.model');
const UserChannel = require('../models/user_channel.model');

class channelController {
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
                const result = await Channel.create({
                    admin_id: user_id,
                    title: title,
                    description: description,
                    avatar_url: avatar_url,
                });

                console.log(result);
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
            const checkChannelExists = await Channel.checkExistence({ where: { id: channel_id } });
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

            const result = await Channel.delete({
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
            const checkChannelIdExists = await Channel.checkExistence({ where: { id: channel_id } });

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
            const authenAdminId = await Channel.findOne({
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
            const checkChannelIdExists = await Channel.checkExistence({ where: { id: channel_id } });

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
                const adminIdAuth = await Channel.checkExistence({
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
}

module.exports = new channelController();