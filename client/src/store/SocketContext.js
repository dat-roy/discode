import io from "socket.io-client";
import { createContext } from "react";

export const socket = io.connect(process.env.REACT_APP_SERVER_HOST, { reconnection: false });
const SocketContext = createContext({});
export default SocketContext;