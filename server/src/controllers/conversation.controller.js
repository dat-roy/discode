const Conversations = require("../models/conversation.model");
const Users = require('../models/users.model');
class conversationController {
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
    
    async deleteChannel(req, res, next) {
        let {conversation_id, user_id} = req.body;

        try {
            const checkUserIdExists = await Users.checkExistence({where: {id: user_id}});
            const checkConversationIdExists = await Conversations.checkExistence({where: {id: conversation_id}});
            if (!checkUserIdExists) {
                return res.status(404).json({
                    message: "Can not find UsernameId",
                })
            }
            if (!checkConversationIdExists) {
                return res.status(404).json({
                    message: "Can not find ConversationID",
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
}

module.exports = new conversationController();