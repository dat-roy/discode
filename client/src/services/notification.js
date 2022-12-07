import axios from "../config/axios";

const handleGetGlobalNotisAPI = (user_id, source_type) => {
    //Except channel requests.
    return axios.post(`/api/notification/get/global`, {
        user_id, source_type, 
    })    
}

const handleGetChannelRequestsAPI = (admin_id, channel_id) => {
    //Only for admin.
    return axios.post(`/api/notification/get/channel/requests`, {
        admin_id, channel_id, 
    })
}

const handleMarkOneNotiAsReadAPI = (user_id, noti_id) => {
    return axios.post(`/api/notification/read/one`, {
        user_id, noti_id, 
    })
}

const handleMarkAllNotiAsReadAPI = (user_id, source_type, types) => {
    return axios.post(`/api/notification/read/all`, {
        user_id, source_type, types, 
    })
}

export {
    handleGetGlobalNotisAPI, 
    handleGetChannelRequestsAPI, 
    handleMarkOneNotiAsReadAPI, 
    handleMarkAllNotiAsReadAPI, 
}