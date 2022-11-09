import axios from "../config/axios";

const handleGetOldMessages = (my_id, room_id) => {
    return axios.post(`api/message/get/old`, {
        user_id: my_id,
        room_id: room_id,
    })
}

const handleSaveNewMessage = (formData) => {
    // let { sender_id, room_id, content, message_type, parent_message_id } = params;
    // return axios.post(`api/message/save`, {
    //     sender_id: sender_id,
    //     room_id: room_id,
    //     content: content,
    //     message_type: message_type,
    //     parent_message_id: parent_message_id,
    // })

    return axios({
        method: "post", 
        url: "http://localhost:3030/api/message/save", 
        data: formData, 
        headers: {
            "Content-Type" : "multipart/form-data", 
        }
    })
}

export {
    handleGetOldMessages,
    handleSaveNewMessage,
}