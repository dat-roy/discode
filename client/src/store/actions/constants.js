const ActionTypes = Object.freeze({
    REQUEST_LOGIN: "REQUEST_LOGIN",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_FAIL: "LOGIN_FAIL",
    LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
    REGISTER_SUCCESS: "REGISTER_SUCCESS",
})

const SocketActionTypes = Object.freeze({
    CONNECT: "CONNECT", 
    DISCONNECT: "DISCONNECT", 
})

export {
    ActionTypes,
    SocketActionTypes, 
}