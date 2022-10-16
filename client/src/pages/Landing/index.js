import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Link } from 'react-router-dom';

import { UserContext } from "../../store";
import { useStore } from "../../store/hooks";

export default function Landing() {
    const context = useContext(UserContext);
    const [state, dispatch] = useStore();

    if (state.user !== "") {
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