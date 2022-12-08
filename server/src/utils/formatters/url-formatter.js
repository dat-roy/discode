const url = require('node:url');
const dotenv = require('dotenv');
dotenv.config();
const backendHostname = process.env.BACKEND_HOST;
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