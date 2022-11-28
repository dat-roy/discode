import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../../store/hooks";
import InnerInbox from "./InnerInbox";

import { handleGetCommonSingleRoomsAPI, handleGetUserByIdAPI } from "../../../services";

export default function Inbox() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const [state,] = useStore();
    const [otherUser, setOtherUser] = useState(null);
    const [commonRoom, setCommonRoom] = useState(null);

    const myID = state.user.id;
    let otherID = parseInt(params.id);
    // console.log("My id: " + myID);
    // console.log("Other id: " + otherID);

    useEffect(() => {
        setOtherUser(location.state?.partner_data);
        handleGetCommonSingleRoomsAPI(myID, otherID)
            .then((response) => {
                if (response.data.common_room) {
                    setCommonRoom(response?.data?.common_room[0])
                }
            })
    }, [params, myID, otherID, location.state?.partner_data])

    useEffect(() => {
        if (otherID && otherID !== myID && !otherUser) {
            handleGetUserByIdAPI(otherID)
                .then(response => {
                    if (!response.data.user_data) {
                        return navigate('/err/invalid-user-id')
                    } else {
                        setOtherUser(response.data.user_data);
                    }
                })
        }

        if (myID && otherUser && !commonRoom) {
            handleGetCommonSingleRoomsAPI(myID, otherID)
                .then(response => {
                    if (response.data?.common_room) {
                        setCommonRoom(response?.data?.common_room[0])
                    }
                })
        }
    }, [myID, otherID, otherUser, navigate, commonRoom])

    if (!otherID || otherID === myID) {
        return (
            <div style={{ padding: 20 }}>
                <h3>Select a chat or create a new conversation</h3>
            </div>
        )
    }
    if (myID && otherUser) {
        return <InnerInbox
            myID={myID}
            otherUser={otherUser}
            commonRoom={commonRoom}
            setCommonRoom={setCommonRoom}
        />
    }
}