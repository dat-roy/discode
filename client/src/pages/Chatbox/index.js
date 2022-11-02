import React from "react";
import { useState, useEffect } from "react";
import { handleGetJoinedConversations } from "../../services/app";
import { useStore } from "../../store/hooks";
import { ConversationTypes } from "../../types/db.type";

export default function Chatbox() {
    const [state, dispatch] = useStore();
    const [singleConv, setSingleConv] = useState([])
    const [groupConv, setGroupConv] = useState([])
    useEffect( async () => {
        const result = await handleGetJoinedConversations(state.user.id, ConversationTypes.ALL);
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
    }, [])

    return (
        <>
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
        </>
    )
} 