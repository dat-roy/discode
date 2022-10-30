import React from "react";
import { Navigate } from "react-router-dom";
import { Link } from 'react-router-dom';

import { useStore } from "../../store/hooks";

export default function Landing() {
    const [state, dispatch] = useStore();

    if (state.isLogged) {
        return <Navigate to="/home" replace />
    } else {
        return (
            <div id="landing">
                <p>Welcome to discode!</p>
                <Link to='/login'>Login</Link>
            </div>
        )
    }
} 