import axios from "../config/axios";
const serverHost = (process.env.NODE_ENV === 'production')
    ? process.env.REACT_APP_PROD_SERVER_HOST
    : process.env.REACT_APP_DEV_SERVER_HOST

const handleGetOldMessagesAPI = (my_id, room_id) => {
    return axios.post(`api/message/get/old`, {
        user_id: my_id,
        room_id,
    })
}

const handleGetOldMessagesWithOffsetAPI = (my_id, room_id, offset) => {
    return axios.post(`api/message/get/old/with-offset`, {
        user_id: my_id,
        room_id, offset,
    })
}

const handleMarkReadMessagesAPI = (my_id, room_id) => {
    return axios.post(`api/message/mark/read`, {
        user_id: my_id,
        room_id,
    })
}

const handleCountAllUnreadMessagesAPI = (user_id, type) => {
    return axios.get(`api/message/count/all/unread/?user_id=${user_id}&type=${type}`)
}

const handleSaveNewMessageAPI = (formData) => {
    return axios({
        method: "post",
        url: `${serverHost}/api/message/save`,
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
}

export {
    handleGetOldMessagesAPI,
    handleGetOldMessagesWithOffsetAPI,
    handleMarkReadMessagesAPI,
    handleCountAllUnreadMessagesAPI,
    handleSaveNewMessageAPI,
};
