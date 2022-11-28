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

const handleGetChannelByIdAPI = (user_id, channel_id) => {
    return axios.get(`/api/channel/${channel_id}?user_id=${user_id}`)
}

const handleCheckChannelExistenceAPI = (title) => {
    return axios.get(`/api/channel/check/title/${title}`)
}

const handleCreateNewChannelAPI = (formData) => {
    return axios({
        method: "post", 
        url: `${process.env.REACT_APP_SERVER_HOST}/api/channel/create`, 
        data: formData, 
        headers: {
            "Content-Type" : "multipart/form-data", 
        }
    })
}

const handleGetChannelMembers = (channel_id) => {
    return axios.post(`/api/channel/get/members/`, {
        channel_id,
    })
}

const handleGetJoinedChannelsAPI = (user_id) => {
    return axios.post(`/api/channel/get/joined-channels`, {
        user_id,
    })
}

const handleGetGroupRoomsAPI = (user_id, channel_id) => {
    return axios.post(`/api/channel/get/rooms`, {
        user_id,
        channel_id,
    })
}

const handleGetGroupRoomByIdAPI = (room_id) => {
    return axios.get(`/api/channel/get/room/${room_id}`);
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
    handleGetChannelByIdAPI,
    handleCheckChannelExistenceAPI,
    handleCreateNewChannelAPI,
    handleGetChannelMembers,
    handleGetJoinedSingleRoomsAPI,
    handleGetJoinedChannelsAPI,
    handleGetGroupRoomsAPI,
    handleGetGroupRoomByIdAPI,
    handleGetCommonSingleRoomsAPI,
    handleCreateNewSingleRoomAPI,
    handleGetReadStatusAPI,
}