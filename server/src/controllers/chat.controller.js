const Participants = require('../models/participants.model')
const Conversation = require('../models/conversation.model')
const { ConversationTypes } = require('../types/db.type')

class chatController {
    //[POST] /api/chat/get/joined-conversations/
    async getJoinedConversations(req, res, next) {
        /**
         * Request body:
         * * user_id
         * * conv_type: ENUM("single", "group", "all")
         */
        const { user_id } = req.body;
        const { conv_type } = req.body;
        try {
            const rows = await Participants.findAll({
                where: {
                    users_id: user_id,
                }
            })
            if (! rows || rows.length === 0) {
                return res.status(200).json({
                    message: "No conversation found",
                    conv_list: [],
                })
            }
            
            if (conv_type === ConversationTypes.ALL) {
                return res.status(200).json({
                    message: "Get joined conversations successfully",
                    conv_list: rows,
                })
            }

            //conv_type === ConversationTypes.SINGLE ||
            //conv_type === ConversationTypes.Group
            return res.status(200).json({
                message: "Get joined conversations successfully",
                conv_list: rows.filter((elem) => {
                    return (elem.type === conv_type);
                })
            })
        } catch (err) {
            console.log(err.message);
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }

    //[GET] /api/chat/get/conversation/:id
    async getConversationByID(req, res, next) {
        const conv_id = req.params.id;
        try {
            const conv_data = await Conversation.findOne({
                where: {
                    id: conv_id, 
                }
            })
            if (! conv_data) {
                return res.status(200).json({
                    message: "Empty result"
                })
            }
            res.status(200).json(conv_data);
        } catch (err) {
            res.status(500).json({
                message: "Internal Server Error",
            })
        }
    }
}

module.exports = new chatController();