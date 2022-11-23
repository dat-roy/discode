import { SocketActionTypes } from "../actions/constants";
import io from "socket.io-client";

const initialState = {
    instance: io.connect(process.env.REACT_APP_SERVER_HOST),
}

function reducer(socketState, action) {
    switch (action.type) {
        case SocketActionTypes.CONNECT:
            return {
                ...socketState,
                instance: io.connect(process.env.REACT_APP_SERVER_HOST),
            }
        case SocketActionTypes.DISCONNECT:
            if (socketState.instance) {
                socketState.instance.disconnect();
            }
            return {
                ...socketState,
                //instance: io.connect(process.env.REACT_APP_SERVER_HOST), 
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