import axios from "../config/axios";
const serverHost = (process.env.NODE_ENV === 'production')
    ? process.env.REACT_APP_PROD_SERVER_HOST
    : process.env.REACT_APP_DEV_SERVER_HOST

const handleGetChannelByIdAPI = (user_id, channel_id) => {
    return axios.get(`/api/channel/${channel_id}?user_id=${user_id}`)
}

const handleCheckChannelExistenceAPI = (title) => {
    return axios.get(`/api/channel/check/title/${title}`)
}

const handleCreateNewChannelAPI = (formData) => {
    return axios({
        method: "post",
        url: `${serverHost}/api/channel/create`,
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
}

const handleAddMemberAPI = (user_id, channel_id) => {
    return axios.post(`/api/channel/add-member`, {
        user_id, channel_id,
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

const handleRequestJoiningAPI = (sender_id, receiver_id, channel_id) => {
    return axios.post(`/api/channel/request`, {
        sender_id, receiver_id, channel_id,
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
    handleAddMemberAPI,
    handleGetFeaturedChannelsAPI,
    handleGetChannelMembersAPI,
    handleGetJoinedChannelsAPI,
    handleGetGroupRoomsAPI,
    handleGetGroupRoomByIdAPI,
    handleCreateNewChannelRoomAPI,
    handleInvitePeopleAPI,
    handleReplyInvitationAPI,
    handleRequestJoiningAPI,
    handleReplyRequestAPI,
}