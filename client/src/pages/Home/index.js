import React from "react";
import { userActions } from "../../store/actions/userActions";
import { useStore } from "../../store/hooks";
import { Link } from "react-router-dom";

export default function Home(props) {
    const [state, dispatch] = useStore();

    return (
        <>
            <h1>Home page:</h1>
            <h3>Username: { state.user.username }</h3>
            <h4>Email: { state.user.email }</h4>
            <img src={state.user.avatar_url} alt="avt"/>
            <br/><br/>
            <Link to='/profile'>View my profile</Link>
            <br/><br/>
            <button onClick={() => {dispatch(userActions.userLogout())}}>Logout</button>
        </>
    )
} 