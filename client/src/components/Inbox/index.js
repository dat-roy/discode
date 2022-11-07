import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../store/hooks";
import InnerInbox from "./InnerInbox";

import { handleGetCommonSingleRoomsAPI, handleGetUserByIdAPI } from "../../services";

export default function Inbox() {
    const navigate = useNavigate();
    const params = useParams();

    const [state,] = useStore();
    const [otherUser, setOtherUser] = useState(null);
    const [commonRoom, setCommonRoom] = useState(null);

    const myID = state.user.id;
    const otherID = parseInt(params.id);
    // console.log("My id: " + myID);
    // console.log("Other id: " + otherID);

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
            async function checkCommonSingleRoom() {
                const response = await handleGetCommonSingleRoomsAPI(myID, otherID);
                if (response) {
                    if (response.data.common_room) {
                        setCommonRoom(response?.data?.common_room[0])
                    }
                }
            }
            checkCommonSingleRoom();
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