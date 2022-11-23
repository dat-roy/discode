import React, { useEffect, useReducer } from "react";
import { SocketActionTypes } from "./actions/constants";
import { useStore } from "./hooks";
import reducer, { initialState } from "./reducers/socketReducer";
import SocketContext from "./SocketContext";

const SocketProvider = ({ children }) => {
    const [state,] = useStore();
    const [socketState, socketDispatch] = useReducer(
        reducer,
        (state.isLogged) ? initialState : null
    );

    useEffect(() => {
        return () => {
            socketDispatch(SocketActionTypes.DISCONNECT);
        }
    }, [])

    return (
        <SocketContext.Provider value={[socketState, socketDispatch]}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;