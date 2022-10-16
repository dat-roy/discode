import React from "react";
import { useReducer } from "react";
import reducer, { initialState } from "./reducers/userReducer";
import UserContext from "./UserContext";

const UserProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(reducer, initialState);

    return (
        <UserContext.Provider value={[ state, dispatch ]}>
            { children } 
        </UserContext.Provider>
    )
}

export default UserProvider;