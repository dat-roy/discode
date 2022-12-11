import axios from 'axios';
const serverHost = (process.env.NODE_ENV === 'production')
    ? process.env.REACT_APP_PROD_SERVER_HOST
    : process.env.REACT_APP_DEV_SERVER_HOST

const instance = axios.create({
    baseURL: serverHost,
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