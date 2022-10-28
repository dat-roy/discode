import React from "react"
import { useStore } from "../store/hooks"; 
import { Route, Redirect } from 'react-router-dom'
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
    const [state, dispatch] = useStore();
    if (state.isLogged) {
        return children;
    }
    return <Navigate to="/" replace />;
}