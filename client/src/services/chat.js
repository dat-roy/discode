import axios from "../config/axios";

const handleGetJoinedSingleRoomsAPI = (user_id, conv_type) => {
    return axios.post(`/api/chat/get/joined/single-rooms`, {
        user_id: user_id, 
        conv_type: conv_type,
    })
}

const handleGetCommonConversationsAPI = (myID, otherID, type) => {
    return axios.post(`/api/chat/get/common-conversations`, {
        my_id: myID, 
        other_id: otherID, 
        type: type, 
    })
}

export {
    handleGetJoinedSingleRoomsAPI, 
    handleGetCommonConversationsAPI,
}