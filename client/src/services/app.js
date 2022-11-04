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

export {
    handleGetUserByIdAPI,
    handleGetUserByUsernameAPI, 
    handleSearchUserByTextAPI,
}