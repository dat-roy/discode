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
            const checkAvailableTitleWithIdExists = await Conversations.findOne({
                attributes: [
                    'creator_id', 'title'
                ],
                where: 
                    `creator_id = ${id} AND title = '${title}'`
            })

            if (checkAvailableTitleWithIdExists) {
                return res.status(404).json({
                    message: "Same channel's name already",
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
    
    //[POST] /api/channel/remove
    async deleteChannel(req, res, next) {
        let {conversation_id, user_id} = req.body;

        try {
            const checkUserIdExists = await Users.checkExistence({where: {id: user_id}});
            const checkConversationIdExists = await Conversations.checkExistence({where: {id: conversation_id}});
            if (!checkUserIdExists) {
                return res.status(404).json({
                    message: "Can not detect User Id",
                })
            }
            if (!checkConversationIdExists) {
                return res.status(404).json({
                    message: "Can not detect Conversation ID",
                })
            }

            const checkAdminChannel = await Conversations.findOne({
                attributes: [
                    'creator_id', 'id'
                ],
                where: 
                    `creator_id = ${user_id} AND id = '${conversation_id}'`
            })
            if (!checkAdminChannel) {
                return res.status(404).json({
                    message: "Id is not admin",
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
        let {creator_id, deleted_id, conv_id} = req.body;
        try {
            //check valid
            const checkCreatorIdExists =  await Users.checkExistence({where: {id: creator_id}});
            const checkDeletedIdIdExists = await Users.checkExistence({where: {id: deleted_id}});
            const checkConvIdExists = await Conversations.checkExistence({where: {id : conv_id}});
            
            if (!checkCreatorIdExists) {
                return res.status(404).json({
                    message: "Can not detect CreatorID"
                })
            }
            if (!checkDeletedIdIdExists) {
                console.log(checkDeletedIdIdExists);
                return res.status(404).json({
                    message: "Can not detect deleteID"
                })
            }
            if (!checkConvIdExists) {
                return res.status(404).json({
                    message: "Can not detect ConversationID"
                })
            }
            
            //check authenticate
            const authenCreatorId = await Conversations.findOne({
                attributes: [
                    "id", "creator_id"
                ],
                where: 
                    `id = ${conv_id} AND creator_id = ${creator_id}`
            })
            console.log(authenCreatorId);

            if (!authenCreatorId) {
                return res.status(404).json({
                    message: "ID is not Admin",
                })
            }
            
            //check deleteId in conversation
            const checkDeleteIdInConv = await Participants.findOne({
                attributes: [
                    'conv_id', 'users_id',
                ],
                where:
                    `conv_id = ${conv_id} AND users_id = ${deleted_id}`,
            
            })

            if (!checkDeleteIdInConv) {
                return res.status(404).json({
                    message: "ID want to delete is not in conversation",
                })
            }
            
            // Delete Id
            if (authenCreatorId && checkDeleteIdInConv) {
                const result = await Participants.deleteMember(deleted_id, conv_id);
                return res.status(200).json({
                    message: "Delete Member from Conversation Successfully",
                    result: result
                });
            }

          
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                message: "An internal error from server",
            })
        }
    }

    async addMemberToConversation(req, res, next) {
        /*
            Creator_id, request_id, conv_id
            Check Valid
            Check Admin group
            Check member already in Conv => if not
            ADD 
        */
        let {creator_id, req_id, conv_id} = req.body;
        
        try {
            const checkCreatorIdExists =  await Users.checkExistence({where: {id: creator_id}});
            const checkReqIdIdExists = await Users.checkExistence({where: {id: req_id}});
            const checkConvIdExists = await Conversations.checkExistence({where: {id : conv_id}});
            
            // check valid
            if (!checkCreatorIdExists) {
                return res.status(404).json({
                    message: "Can not detect CreatorID"
                })
            }
            if (!checkReqIdIdExists) {
                return res.status(404).json({
                    message: "Can not detect RequestID"
                })
            }
            if (!checkConvIdExists) {
                return res.status(404).json({
                    message: "Can not detect ConversationID"
                })
            }

            //check authenticate
            const authenCreatorId = await Conversations.findOne({
                attributes: [
                    "id", "creator_id"
                ],
                where: 
                    `id = ${conv_id} AND creator_id = ${creator_id}`
            })

            if (!authenCreatorId) {
                return res.status(404).json({
                    message: "ID is not Admin",
                })
            }

            //Check request in conversation
            const checkRequestIdInConv = await Participants.findOne({
                Attributes: [
                    'conv_id', 'users_id',
                ],
                Where:
                    `conv_id = ${conv_id} AND users_id = ${req_id}`
            })

            if (checkRequestIdInConv) {
                return res.status(404).json({
                    message: "Request ID is available in conversation",
                })
            }

            // Add Member to Conv
            const result = await Participants.addMember(req_id, conv_id);
            return res.status(200).json({
                message: "Add member successfully",
                result: result,
            })
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                message: "An internal error from server",
            })
        }
    }
}

module.exports = new channelController();