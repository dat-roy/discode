const url = require('node:url');
const dotenv = require('dotenv');
dotenv.config();
const backendHostname = (process.env.NODE_ENV === 'production')
    ? process.env.PROD_BACKEND_HOST
    : process.env.DEV_BACKEND_HOST;
const { isValidHttpUrl } = require('../is-valid-http-url')

const formatMediaURL = (input) => {
    if (!isValidHttpUrl(input)) {
        return url.parse(backendHostname + '/' + input).href
    }
    return input;
}

module.exports = {
    formatMediaURL,
}