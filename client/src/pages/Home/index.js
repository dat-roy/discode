import React from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../../store/hooks";

export default function Home(props) {
    const [state, dispatch] = useStore();

    if (state.user) {
        return (
            <>
                <h2>Hello my friend!</h2>
                <h3>Username: { state.user.username }</h3>
                <h4>Email: { state.user.email }</h4>
                <img src={state.user.avatar_url} alt="avt"/>
                <br/><br/>
            </>
        )
    } else {
        return <Navigate replace to="/"/>
    }
} 