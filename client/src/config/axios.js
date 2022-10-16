import axios from 'axios';

const instance = axios.create({
    baseURL: "http://localhost:3030",
})

/**:
 * Interceptors help intercept requests or responses
 * before they are handled by `then` or `catch`.
 **/

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = "Bearer " + token;
        }
        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
)

instance.interceptors.response.use((response) => {
    return response.data;
})

export default instance;