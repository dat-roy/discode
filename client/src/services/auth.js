import axios from "../config/axios";

const handleGoogleLoginAPI = (data) => {
    return axios.post("/api/user/auth/google-login", data);
}

const handleNormalLoginAPI = (data) => {
    //return axios.post("/api/user/auth/login", data);
}

const handleLoginByTokenAPI = () => {
    //return axios.get("/api/user");
}

const handleRegisterAPI = (data) => {
    return axios.post("/api/user/auth/register", data);
}

export {
    handleGoogleLoginAPI,
    handleNormalLoginAPI,
    handleLoginByTokenAPI,
    handleRegisterAPI,
}