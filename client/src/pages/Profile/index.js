import React from "react"
import { useStore } from "../../store/hooks"
import { userActions } from "../../store/actions/userActions";
export default function Profile(props) {
    const [state, dispatch] = useStore();
    return (
        <>
            <h2>Hello "{ state.user.username }"</h2>
            <h4>Email: { state.user.email }</h4>
            <img src={state.user.avatar_url} alt="avt"/>
            <h5><i>There's more...</i></h5>
            <button onClick={() => {dispatch(userActions.userLogout())}}>Logout</button>
        </>
    )
} 