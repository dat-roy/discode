import { SocketActionTypes } from "../actions/constants";
import io from "socket.io-client";
const serverHost = (process.env.NODE_ENV === 'production')
    ? process.env.REACT_APP_PROD_SERVER_HOST
    : process.env.REACT_APP_DEV_SERVER_HOST

const initialState = {
    instance: io.connect(serverHost),
}

function reducer(socketState, action) {
    switch (action.type) {
        case SocketActionTypes.CONNECT:
            return {
                ...socketState,
                instance: io.connect(serverHost),
            }
        case SocketActionTypes.DISCONNECT:
            if (socketState.instance) {
                socketState.instance.disconnect();
            }
            return {
                ...socketState,
                //instance: io.connect(serverHost), 
                instance: null, 
            }
        default:
            return {
                ...socketState,
            }
    }
}

export { initialState };
export default reducer;