import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../../store/hooks"
import PageNotFound from "../PageNotFound";
import { handleGetUserByUsernameAPI } from "../../services";

export default function Profile() {
    const navigate = useNavigate();
    const [state, ] = useStore();
    const [userInfo, setUserInfo] = useState(null);
    const param = new URLSearchParams(useLocation().search).get("username");
    useEffect(() => {
        async function fetchData() {
            const response = await handleGetUserByUsernameAPI(param)
            if (response.data.user_data) {
                setUserInfo(response.data.user_data);
            }
        }
        fetchData();
    }, [param])

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
            </>
        )
    } else {

        const handleOpenInbox = () => {
            navigate(`/chat/${userInfo.id}`)
        }

        return (
            <>
                <h2>User: "{ userInfo.username }" (Another people)</h2>
                <h4>Email: { userInfo.email }</h4>
                <img alt="avatar" src={ userInfo.avatar_url } />
                <h5><i>There's more...</i></h5>
                <button>Follow</button>
                <button onClick={handleOpenInbox}>Open chat inbox</button>
            </>
        )
    }
} 