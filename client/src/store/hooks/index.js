import { useContext } from 'react';
import SocketContext from '../SocketContext';
import UserContext from '../UserContext';

export const useStore = () => {
    const [state, dispatch] = useContext(UserContext);
    return [state, dispatch];
}

export const useSocket = () => {
    const [socketState, socketDispatch] = useContext(SocketContext);
    // console.log("Socket state")
    // console.log(socketState)
    // console.log("Socket dispatch")
    // console.log(socketDispatch)
    return [socketState, socketDispatch];
}