import axios from "../config/axios";

const handleSearchUserAPI = (value) => {
    return axios.get(`/api/search/user/${value}`)
}

const handleSearchUserByUsername = (username) => {
    return axios.get(`/api/user/get/${username}`)
}

const handleGetJoinedConversations = (user_id, conv_type) => {
    return axios.post(`/api/chat/get/joined-conversations`, {
        user_id: user_id, 
        conv_type: conv_type,
    })
}

export {
    handleSearchUserAPI,
    handleSearchUserByUsername, 
    handleGetJoinedConversations,
}