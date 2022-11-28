import axios from "../config/axios";

const handleGetOldMessagesAPI = (my_id, room_id) => {
    return axios.post(`api/message/get/old`, {
        user_id: my_id,
        room_id,
    })
}

const handleMarkReadMessagesAPI = (my_id, room_id) => {
    return axios.post(`api/message/mark/read`, {
        user_id: my_id, 
        room_id, 
    })
}

const handleSaveNewMessageAPI = (formData) => {
    return axios({
        method: "post", 
        url: `${process.env.REACT_APP_SERVER_HOST}/api/message/save`, 
        data: formData, 
        headers: {
            "Content-Type" : "multipart/form-data", 
        }
    })
}

export {
    handleGetOldMessagesAPI,
    handleMarkReadMessagesAPI, 
    handleSaveNewMessageAPI,
}