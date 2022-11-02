import React from "react";
import { Navigate } from "react-router-dom";
import { Link } from 'react-router-dom';

import { useStore } from "../../store/hooks";

export default function Landing() {
    const [state, ] = useStore();

    if (state.isLogged) {
        return <Navigate to="/home" replace />
    } else {
        return (
            <div id="landing">
                <h4>This is a landing page</h4>
                <p>Welcome to discode!</p>
                <Link to='/login'>Login</Link>
            </div>
        )
    }
} 