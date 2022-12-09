import axios from "../config/axios";

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

const handleGetFeaturedChannelsAPI = () => {
    return axios.get(`/api/channel/get/featured`);
}

const handleGetChannelMembersAPI = (channel_id) => {
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

const handleCreateNewChannelRoomAPI = (channel_id, admin_id, room_name) => {
    return axios.post(`/api/channel/create/room`, {
        channel_id, admin_id, room_name,
    })
}

const handleInvitePeopleAPI = (sender_id, receiver_id, channel_id) => {
    return axios.post(`/api/channel/invite`, {
        sender_id, receiver_id, channel_id, 
    })
}

const handleReplyInvitationAPI = (user_id, channel_id, noti_id, accept) => {
    return axios.post(`/api/channel/invite/reply`, {
        user_id, channel_id, noti_id, accept, 
    })
}

//Only for admins
const handleReplyRequestAPI = (admin_id, user_id, channel_id, accepted) => {
    return axios.post(`/api/channel/request/reply`, {
        admin_id, user_id, channel_id, accepted, 
    })
}

export {
    handleGetChannelByIdAPI,
    handleCheckChannelExistenceAPI,
    handleCreateNewChannelAPI,
    handleGetFeaturedChannelsAPI, 
    handleGetChannelMembersAPI,
    handleGetJoinedChannelsAPI,
    handleGetGroupRoomsAPI,
    handleGetGroupRoomByIdAPI,
    handleCreateNewChannelRoomAPI,
    handleInvitePeopleAPI,
    handleReplyInvitationAPI, 
    handleReplyRequestAPI, 
}