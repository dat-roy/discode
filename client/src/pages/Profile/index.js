import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../../store/hooks"
import { userActions } from "../../store/actions/userActions";
import PageNotFound from "../PageNotFound";
import { handleSearchUserByUsername } from "../../services/app";

export default function Profile() {
    const navigate = useNavigate();
    const [state, dispatch] = useStore();
    const [userInfo, setUserInfo] = useState(null);
    const param = new URLSearchParams(useLocation().search).get("username");
    useEffect(async () => {
        const results = await handleSearchUserByUsername(param)
        console.log(results);
        if (results.data.user_data) {
            setUserInfo(results.data.user_data);
        }
    }, [])

    if (!userInfo || ! userInfo.username) {
        return <PageNotFound/>
    }
    if (userInfo.username === state.user.username) {
        return (
            <>
                <h2>Hello "{ state.user.username }" (This is me)</h2>
                <h4>Email: { state.user.email }</h4>
                <img src={ state.user.avatar_url } alt="avt"/>
                <h5><i>There's more...</i></h5>
                <button onClick={() => {dispatch(userActions.userLogout())}}>Logout</button>
            </>
        )
    } else {

        const handleOpenInbox = () => {
            navigate("/inbox", {
                state: {
                    user_id: userInfo.id
                }
            })
        }

        return (
            <>
                <h2>User: "{ userInfo.username }" (Another people)</h2>
                <h4>Email: { userInfo.email }</h4>
                <img src={ userInfo.avatar_url } />
                <h5><i>There's more...</i></h5>
                <button>Follow</button>
                <button onClick={handleOpenInbox}>Open chat inbox</button>
            </>
        )
    }
} 