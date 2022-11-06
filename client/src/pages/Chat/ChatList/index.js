import React from "react";
import { useState, useEffect } from "react";
import { handleGetJoinedSingleRoomsAPI } from "../../../services";
import { useStore } from "../../../store/hooks"
import { RoomTypes } from "../../../types/db.type";

export default function ChatList() {
    const [state, dispatch] = useStore();
    const [singleRoom, setSingleRoom] = useState([])
    useEffect(() => {
        async function fetchData() {
            const result = await handleGetJoinedSingleRoomsAPI(state.user.id, RoomTypes.SINGLE);
            //console.log(result);
            let roomList = result.data.room_list || [];
            setSingleRoom(roomList);
        }
        fetchData();
    }, [state.user.id])

    return (
        <div 
            style={{
                padding: 20,
            }}
        >
            <h2>Here's all my conversations:</h2>
            <h3>Number: {singleRoom.length}</h3>
            <ul>{
                singleRoom.map((obj, index) => {
                    return <li key={index}>
                        {obj.id}
                    </li>
                })
            }</ul>
        </div>
    )
} 