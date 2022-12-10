import axios from "../config/axios";

const handlePublishNewPostAPI = ({author_id, title, content, tag_list}) => {
    return axios.post(`/api/post/save`, {
        author_id, title, content, tag_list
    })
}

const handleGetPostByIdAPI = (post_id) => {
    return axios.get(`/api/post/get/by-post/${post_id}`);
}

const handleGetPostsByAuthorIdAPI = (author_id) => {
    return axios.get(`/api/post/get/by-author/${author_id}`);
}

const handleGetHotPostsAPI = () => {
    return axios.get(`/api/post/get/featured/posts`);
}

const handleGetFeaturedAuthorAPI = () => {
    return axios.get(`/api/post/get/featured/authors`);
}

const handleGetFeaturedTopicsAPI = () => {
    return axios.get(`/api/post/get/featured/topics`);
}

const handleGetLikesNumberAPI = (post_id) => {
    return axios.get(`/api/post/count/likes/${post_id}`);
}

const handleCheckLikedAPI = (post_id, user_id) => {
    return axios.post(`/api/post/check-liked`, {
        post_id, user_id, 
    })
}

const handleToggleLikeButtonAPI = (post_id, user_id, liked) => {
    return axios.post(`/api/post/toggle/like`, {
        post_id, user_id, liked, 
    })
}

const handleGetCommentsAPI = (post_id) => {
    return axios.get(`/api/post/comment/get/${post_id}`)
}

const handleSaveCommentsAPI = (post_id, sender_id, content, parent_comment_id) => {
    return axios.post(`/api/post/comment/save`, {
        post_id, sender_id, content, parent_comment_id, 
    })
}

export {
    handlePublishNewPostAPI, 
    handleGetPostByIdAPI, 
    handleGetPostsByAuthorIdAPI,
    handleGetHotPostsAPI, 
    handleGetFeaturedAuthorAPI, 
    handleGetFeaturedTopicsAPI, 
    handleGetLikesNumberAPI,
    handleCheckLikedAPI, 
    handleToggleLikeButtonAPI, 
    handleGetCommentsAPI, 
    handleSaveCommentsAPI, 
}