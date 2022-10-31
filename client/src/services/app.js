import axios from "../config/axios";

const handleSearchUserAPI = (value) => {
    return axios.get(`/api/search/user?v=${value}`)
}

const handleSearchUserByUsername = (username) => {
    return axios.get(`/api/user/get?username=${username}`)
}

export {
    handleSearchUserAPI,
    handleSearchUserByUsername, 
}