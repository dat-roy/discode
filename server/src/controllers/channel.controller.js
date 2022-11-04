const Conversations = require("../models/conversation.model");
const Users = require('../models/users.model');
const Participants = require('../models/participants.model');
class channelController {
    //[POST] /api/channel/create
    async createChannel(req, res, next) {
        let {id, title} = req.body;
        if (title === '') {
            return res.status(200).json({
                message: "Empty title channel's name",
                results: null,
            })
        }

        try {
            const checkUserIdExists = await Users.checkExistence({where: {id: id}});
            if (!checkUserIdExists) {
                return res.status(404).json({
                    message: "Can not find UsernameId",
                })
            }
            const result = await Conversations.createNewChannel(id, title);
       
            res.status(200).json({
                message: "Create new channel successfully",
                results: result,
            })
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                message: "An internal error from server",
            })
        }
    }
    
    //[POST] /api/channel/delete
    async deleteChannel(req, res, next) {
        let {conversation_id, user_id} = req.body;

        try {
            const checkUserIdExists = await Users.checkExistence({where: {id: user_id}});
            const checkConversationIdExists = await Conversations.checkExistence({where: {id: conversation_id}});
            if (!checkUserIdExists) {
                return res.status(404).json({
                    message: "Can not find User Id",
                })
            }
            if (!checkConversationIdExists) {
                return res.status(404).json({
                    message: "Can not find Conversation ID",
                })
            }
            const result = await Conversations.deleteChannel(user_id, conversation_id);
       
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

    async deleteMember(req, res, next) {
        //creator_id, deleted_id, conv_id
        //check if creator_id & deleted_id & conv_id are valid or not.
        //check role of creator_id.
        //check deleted_id exists in conversation or not.
        //
        let {creator_id, deleted_id, conv_id} = req.body;
        try {
            const checkCreatorIdExists =  await Users.checkExistence({where: {id: creator_id}});
            const checkDeletedIdIdExists = await Users.checkExistence({where: {id: deleted_id}});
            const checkConvIdExists = await Conversations.checkExistence({where: {id : conv_id}});
            
            if (!checkCreatorIdExists) {
                return res.status(404).json({
                    message: "Can not detect CreatorID"
                })
            }
            if (!checkDeletedIdIdExists) {
                return res.status(404).json({
                    message: "Can not detect UserID"
                })
            }
            if (!checkConvIdExists) {
                return res.status(404).json({
                    message: "Can not detect ConversationID"
                })
            }
    
            const authenCreatorId = await Conversations.findOne({
                Attributes: [
                    'creator_id', 'id',
                ],
                Where: {
                    creator_id: creator_id,
                    id: conv_id
                },
            })
    
            if (!authenCreatorId) {
                return res.status(404).json({
                    message: "ID is not Admin",
                })
            }
    
            const checkDeleteIdInConv = await Participants.findOne({
                Attributes: [
                    'conv_id', 'users_id',
                ],
                Where: {
                    conv_id: conv_id,
                    users_id: deleted_id,
                },
            })
            
            if (!checkDeleteIdInConv) {
                return res.status(404).json({
                    message: "ID want to delete is not in conversation",
                })
            }
    
            const result = await Participants.deleteMember(deleted_id, conv_id);
            console.log(result);
            return res.status(200).json({
                message: "Delete Member from Conversation Successfully",
                result: result
            });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                message: "An internal error from server",
            })
        }
    }
}

module.exports = new channelController();