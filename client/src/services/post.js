import axios from "../config/axios";

const handlePublishNewPostAPI = ({author_id, title, content, tag_list}) => {
    return axios.post(`/api/post/save`, {
        author_id: author_id, 
        title: title,
        content: content, 
        tag_list: tag_list
    })
}

const handleGetPostByIdAPI = (post_id) => {
    return axios.get(`/api/post/get/by-post/${post_id}`);
}

const handleGetPostsByAuthorIdAPI = (author_id) => {
    return axios.get(`/api/post/get/by-author/${author_id}`);
}

const handleGetLikesNumberAPI = (post_id) => {
    return axios.get(`/api/post/count/likes/${post_id}`);
}

const handleCheckLikedAPI = (post_id, user_id) => {
    return axios.post(`/api/post/check-liked`, {
        post_id: post_id, 
        user_id: user_id, 
    })
}

const handleToggleLikeButtonAPI = (post_id, user_id, liked) => {
    return axios.post(`/api/post/toggle/like`, {
        post_id: post_id, 
        user_id: user_id, 
        liked: liked, 
    })
}

const handleGetCommentsAPI = (post_id) => {
    return axios.get(`/api/post/get/comment/${post_id}`)
}

export {
    handlePublishNewPostAPI, 
    handleGetPostByIdAPI, 
    handleGetPostsByAuthorIdAPI,
    handleGetLikesNumberAPI,
    handleCheckLikedAPI, 
    handleToggleLikeButtonAPI, 
    handleGetCommentsAPI, 
}