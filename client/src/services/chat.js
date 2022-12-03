import axios from "../config/axios";

const handleGetLastMessageAPI = (user_id, room_id) => {
    return axios.post(`/api/chat/get/last-message`, {
        user_id,
        room_id,
    })
}

const handleGetUnreadMessagesAPI = (user_id, room_id) => {
    return axios.post(`/api/chat/get/unread-messages`, {
        user_id,
        room_id,
    })
}

const handleGetJoinedSingleRoomsAPI = (user_id, fetch_partner_data) => {
    return axios.post(`/api/chat/get/joined/single-rooms`, {
        user_id,
        fetch_partner_data, //boolean
    })
}

const handleGetCommonSingleRoomsAPI = (myID, otherID) => {
    return axios.post(`/api/chat/get/common/single-rooms`, {
        my_id: myID,
        other_id: otherID,
    })
}

const handleCreateNewSingleRoomAPI = (myID, otherID) => {
    return axios.post(`/api/chat/create/single-room`, {
        my_id: myID,
        other_id: otherID,
    })
}

const handleGetReadStatusAPI = (user_id, room_id) => {
    return axios.post(`api/chat/get/seen`, {
        user_id, room_id, 
    })
}

export {
    handleGetLastMessageAPI,
    handleGetUnreadMessagesAPI,
    handleGetJoinedSingleRoomsAPI,
    handleGetCommonSingleRoomsAPI,
    handleCreateNewSingleRoomAPI,
    handleGetReadStatusAPI,
}