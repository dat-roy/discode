import React from "react";
import { useState, useEffect } from "react";
import { handleGetJoinedConversationsAPI } from "../../../services";
import { useStore } from "../../../store/hooks"
import { ConversationTypes } from "../../../types/db.type";

export default function ChatList() {
    const [state, dispatch] = useStore();
    const [singleConv, setSingleConv] = useState([])
    const [groupConv, setGroupConv] = useState([])
    useEffect(() => {
        async function fetchData() {
            const result = await handleGetJoinedConversationsAPI(state.user.id, ConversationTypes.ALL);
            console.log(result);
            let { convList } = result.data;
            if (! convList) {
                convList = []
            }
            setSingleConv(convList.filter(elem => {
                return (elem.type === ConversationTypes.SINGLE)
            })); 
            setGroupConv(convList.filter(elem => {
                return (elem.type === ConversationTypes.GROUP)
            }))
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
            <h3>Number: {singleConv.length}</h3>
            <ul>{
                singleConv || 
                singleConv.map((obj, index) => {
                    return <li key={index}>
                        obj.id
                    </li>
                })
            }</ul>
        </div>
    )
} 