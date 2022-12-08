import axios from "../config/axios";

const handleGetUserByIdAPI = (id) => {
    return axios.get(`/api/user/get/?id=${id}`)
}

const handleGetUserByUsernameAPI = (username) => {
    return axios.get(`/api/user/get/?username=${username}`)
}

const handleSearchUserByTextAPI = (text) => {
    return axios.get(`/api/search/user/${text}`)
}

const handleSearchUserNotInChannelByTextAPI = (sender_id, channel_id, text) => {
    return axios.post(`/api/search/user/channel/not-in`, {
        sender_id, channel_id, text, 
    })
}

const handleSearchChannelAPI = (text) => {
    return axios.get(`/api/search/channel/${text}`);
}

export {
    handleGetUserByIdAPI,
    handleGetUserByUsernameAPI, 
    handleSearchUserByTextAPI,
    handleSearchUserNotInChannelByTextAPI, 
    handleSearchChannelAPI, 
}