const Participants = require('../models/participants.model')
const Conversation = require('../models/conversation.model')
const { ConversationTypes } = require('../types/db.type')

class chatController {
    //[GET] /api/chat/get/conversation/:id
    async getConversationByID(req, res, next) {
        const conv_id = req.params.id;
        try {
            const conv_data = await Conversation.findOne({
                where: {
                    id: conv_id,
                }
            })
            if (!conv_data) {
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
            if (!rows || rows.length === 0) {
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

    ///[POST] /api/chat/get/common-conversations/
    async getCommonConversations(req, res, next) {
        //Note: `my_id, other_id` are guaranteed to be valid.
        const {my_id, other_id, type} = req.body;

        try {
            //find all conversations of my_id that having correct `type` 
            const myConvList = await Participants.findAll({
                attributes: [
                    "conv_id", "users_id", "type", 
                ], 
                where: 
                    `users_id=${my_id} AND type='${type}'`
            })
            if (!myConvList || myConvList.length === 0) {
                return res.status(200).json({
                    message: "No conversation found"
                })
            }

            //find conversations whose a participant is other_id
            let commonConv = []
            for (const conv of myConvList) {
                const existence = await Participants.checkExistence({
                    where: 
                        `conv_id=${conv.conv_id} AND users_id=${other_id} AND type='${type}'`, 
                })
                if (existence) {
                    commonConv.push({
                        conv_id: conv.conv_id, 
                        my_id: my_id, 
                        other_id: other_id, 
                        type: conv.type, 
                    })
                }
            }
            res.status(200).json({
                message: "Find all common conversations successfully (result may be empty)", 
                commonConv: commonConv
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Internal Server Error", 
            })
        }
    }
}

module.exports = new chatController();