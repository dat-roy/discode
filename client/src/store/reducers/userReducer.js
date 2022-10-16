import ActionTypes from "../actions/constants";

const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).user
    : "";

const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).token
    : "";

const initialState =  {
    user: "" || user, 
    token: "" || token,
}

function reducer(state, action) {
    console.log("In reducer: " + JSON.stringify(action));

    switch (action.type) {
        case ActionTypes.REQUEST_LOGIN:
            return {
                ...state,
            };
        case ActionTypes.LOGIN_SUCCESS:
            // localStorage.setItem("user", JSON.stringify(action.payload.user));
            // localStorage.setItem("token", JSON.stringify(action.payload.token));
            return {
                ...state,
                user: action.payload.user_data.username, 
                token: action.payload.token,
            };
        default:
            return {
                ...state, 
            }
            //throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export { initialState };
export default reducer;