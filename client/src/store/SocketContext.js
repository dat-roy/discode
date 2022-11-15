import io from "socket.io-client";
import { createContext } from "react";

const serverHost = "http://localhost:3030";
export const socket = io.connect(serverHost, { reconnection: false });
const SocketContext = createContext({});
export default SocketContext;