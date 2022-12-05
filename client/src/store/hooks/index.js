import { useContext } from 'react';
import NotiContext from '../NotiContext';
import SocketContext from '../SocketContext';
import UserContext from '../UserContext';

export const useStore = () => {
    const [state, dispatch] = useContext(UserContext);
    return [state, dispatch];
}

export const useSocket = () => {
    const [socketState, socketDispatch] = useContext(SocketContext);
    return [socketState, socketDispatch];
}

export const useNoti = () => {
    const [notiState, notiDispatch] = useContext(NotiContext);
    return [notiState, notiDispatch];
}