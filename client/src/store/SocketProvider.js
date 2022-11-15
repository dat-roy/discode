import React, { useEffect } from "react";
import SocketContext, {socket} from "./SocketContext";

const SocketProvider = ({ children }) => {
    useEffect(() => {
        return () => {
            socket.disconnect();
        }
    }, [])
    return (
        <SocketContext.Provider value={socket}>
            { children } 
        </SocketContext.Provider>
    )
}

export default SocketProvider;