import { useContext } from 'react';
import UserContext from '../UserContext';

export const useStore = () => {
    const [state, dispatch] = useContext(UserContext);
    return [state, dispatch];
}