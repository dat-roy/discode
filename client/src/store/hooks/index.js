import { useContext } from 'react';
import SocketContext from '../SocketContext';
import UserContext from '../UserContext';

export const useStore = () => {
    const [state, dispatch] = useContext(UserContext);
    return [state, dispatch];
}

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}