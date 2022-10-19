import ActionTypes from "../actions/constants";

const user = (localStorage.getItem("session"))
    ? JSON.parse(localStorage.getItem("session")).user 
    : "";

const token = localStorage.getItem("session")
    ? JSON.parse(localStorage.getItem("session")).token
    : "";

const initialState =  {
    /**
     * Caution: ("" || undefined) --> undefined
     * Don't write: 
     * * user: ("" || user),
     */
    user: (! user) ? "" : user, 
    token: (! token) ? "" : token,
}

function reducer(state, action) {
    //console.log("In reducer: " + JSON.stringify(action));

    switch (action.type) {
        case ActionTypes.REQUEST_LOGIN:
            return {
                ...state,
            };
        case ActionTypes.LOGIN_SUCCESS:
            localStorage.setItem("session", JSON.stringify({
                user: action.payload.user_data,
                token: action.payload.token,
            }));
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