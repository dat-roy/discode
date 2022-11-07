import React from "react";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
//import { useStore } from "../../../store/hooks";

import { Box, TextareaAutosize, Button } from "@mui/material";
import ChatMsg from '../../ChatMsg';
import SendIcon from '@mui/icons-material/Send';

import { handleGetOldMessages, handleSaveNewMessage } from "../../../services/message";
import { MessageTypes } from "../../../types/db.type"
import { handleCreateNewSingleRoomAPI } from "../../../services";

const serverHost = "http://localhost:3030";

export default function InnerInbox({ myID, otherUser, commonRoom, setCommonRoom }) {
    //console.log("Inner box")
    const socketRef = useRef();
    const latestMessage = useRef();

    //const [state, dispatch] = useStore();
    const [allMessages, setAllMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (commonRoom) {
            handleGetOldMessages(myID, commonRoom.room_id)
                .then(response => {
                    console.log(response.data.messages);
                    setAllMessages(response.data.messages);
                })
        }
    }, [myID, commonRoom])

    useEffect(() => {
        if (commonRoom) {
            //console.log("Common Room")
            //console.log(commonRoom) 
            socketRef.current = io.connect(serverHost);
            socketRef.current.emit('joinRoom', commonRoom.room_id);

            //Add a new message to oldMsg
            socketRef.current.on('sendDataServer', newMsg => {
                //console.log(newMsg);
                setAllMessages(oldMsgs => [...oldMsgs, newMsg]);
                //console.log(allMessages);
                scrollToBottom()
            })
        }
    }, [allMessages, commonRoom]);

    const scrollToBottom = () => {
        latestMessage.current.scrollIntoView({ behavior: "smooth" });
    }

    const filterAllMessages = () => {
        let lastSide = null;
        const result = [];
        //console.log("All messages")
        //console.log(allMessages);

        for (const msg of allMessages) {
            const side = (!msg.sender_id)
                ? "center"
                : (msg.sender_id === myID)
                    ? "right" : "left";

            if (side !== lastSide) {
                result.push({
                    avatar: otherUser.avatar_url,
                    side: side,
                    msgArr: [],
                })
            }
            result[result.length - 1].msgArr.push(msg.content)
            lastSide = side;
        }
        return result;
    }

    const sendMessage = () => {
        if (message !== null && message !== '') {
            const msg = {
                content: message,
                sender_id: myID,
            }
            if (!commonRoom) {
                //Create new room, user_room, message, message_recipient.
                //Join room.
            } else {
                socketRef.current.emit('sendDataClient', msg, commonRoom.room_id);
                const message_type = MessageTypes.TEXT;
                handleSaveNewMessage({
                    sender_id: myID,
                    room_id: commonRoom.room_id,
                    content: message,
                    message_type: message_type,
                    parent_message_id: null,
                })
                    .then(response => {
                        //console.log(response);
                        setMessage('');
                    })
            }
            //setMessage('');
        }
    }

    const handleCreateNewRoom = async () => {
        const response = await handleCreateNewSingleRoomAPI(myID, otherUser.id)   
        //console.log(response); 

        if (response.status === 200) {
            const newRoom = response.data.room_data[0]
            const message_type = MessageTypes.TEXT

            handleSaveNewMessage({
                sender_id: myID, 
                room_id: newRoom.room_id, 
                content: "HELLO HELLO",
                message_type: message_type, 
                parent_message_id: null, 
            })
                .then(response => {
                    //console.log(response);
                    setMessage('');
                    setCommonRoom(newRoom);
                })  
        }
    }

    return (
        <Box
            className="boxChat"
            sx={{
                width: "90%",
                height: "100vh",
                margin: "0 auto",
                marginTop: 2,
                boxShadow: "0 0 10px 0 black",
            }}
        >
            <Box
                className="boxChatMessage"
                sx={{
                    padding: 3,
                    width: "90%",
                    minHeight: "80vh",
                    maxHeight: "80vh",
                    overflowX: "hidden",
                    overflowY: "auto",
                }}
            >
                <Button
                    style={{
                        display: (commonRoom) ? "none" : "block"
                    }} 
                    onClick={handleCreateNewRoom}
                >
                    Start a chat
                </Button>
                {
                    filterAllMessages().map((obj, index) => {
                        const {
                            avatar, side, msgArr
                        } = obj
                        return (
                            <ChatMsg
                                key={index}
                                avatar={avatar}
                                side={side}
                                messages={msgArr}
                            />
                        )
                    })
                }
                <Box
                    sx={{
                        float: "left",
                        clear: "both",
                    }}
                    ref={latestMessage}
                />
            </Box>

            <Box
                className="sendBox"
                sx={{
                    float: "bottom",
                    width: "100%",
                    minHeight: "10vh",
                    bottom: 0,
                }}
            >
                <TextareaAutosize
                    disabled={(commonRoom) ? false : true}
                    autoFocus={true}
                    value={message}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.shiftKey === false) {
                            sendMessage()
                        }
                    }}
                    onChange={(e) => {
                        setMessage(e.target.value)
                    }}
                    placeholder={"Enter message..."}
                    style={{
                        width: "50%",
                        margin: 0,
                        background: "#ebf5ff",
                        borderRadius: 30,
                        resize: "none",
                        overflow: "auto",
                        border: "none",
                        outline: "none",
                        "&:focus": {
                            border: "none"
                        }
                    }}
                />
                <Button
                    disabled={(commonRoom) ? false : true}
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={sendMessage}
                    sx={{
                        "&:disabled": {
                            color: "white",
                            backgroundColor: 'gray'
                        }
                    }}
                >
                    Send
                </Button>
            </Box>
        </Box>
    )
}