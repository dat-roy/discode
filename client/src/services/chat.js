import axios from "../config/axios";

const handleGetJoinedSingleRoomsAPI = (user_id) => {
    return axios.post(`/api/chat/get/joined/single-rooms`, {
        user_id: user_id, 
    })
}

const handleGetCommonSingleRoomsAPI = (myID, otherID) => {
    return axios.post(`/api/chat/get/common/single-rooms`, {
        my_id: myID, 
        other_id: otherID, 
    })
}

export {
    handleGetJoinedSingleRoomsAPI, 
    handleGetCommonSingleRoomsAPI,
}