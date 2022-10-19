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
        const session = localStorage.getItem("session");
        if (session) {
            config.headers.Authorization = "Bearer " + session.token;
        }
        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
)

instance.interceptors.response.use((response) => {
    return response;
})

export default instance;