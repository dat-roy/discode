import React from "react";
import { useState, useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useStore } from "../../store/hooks";

import { Box, TextareaAutosize, Button } from "@mui/material";
import ChatMsg from '@mui-treasury/components/chatMsg/ChatMsg';
import SendIcon from '@mui/icons-material/Send';


const serverHost = "http://localhost:3030";

export default function Inbox() {
    const location = useLocation();
    const socketRef = useRef();
    const latestMessage = useRef();

    const [state, dispatch] = useStore();
    const [allMessages, setAllMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [room, setRoom] = useState();

    // if (! location.state) {
    //     return <Navigate replace to="/err/invalid-user-id"/>
    // }

    const myID = state.user.id;
    // const otherID = location.state.user_id || null; 
    // console.log("My id: " + myID);
    // console.log("Other id: " + otherID);

    useEffect(() => {
        socketRef.current = io.connect(serverHost);
        const param = new URLSearchParams(location.search).get("room");
        if (!room) {
            setRoom(param);
            socketRef.current.emit('joinRoom', param, (message) => {
                setAllMessages(oldMsgs => [...oldMsgs, { content: message, id: null }]);
            });
        }
    }, []);

    useEffect(() => {
        //Add a new message to oldMsg
        socketRef.current.on('sendDataServer', newMsg => {
            setAllMessages(oldMsgs => [...oldMsgs, newMsg]);
            scrollToBottom()
        })
    }, [])

    const scrollToBottom = () => {
        latestMessage.current.scrollIntoView({ behavior: "smooth" });
    }

    const renderAllMessages = allMessages.map((obj, index) => {
        const side = (!obj.sender_id)
            ? "center"
            : (obj.sender_id === myID)
                ? "right" : "left";

        // let notificationStyle = null;
        // if (side === "center") {
        //     notificationStyle = {
        //         textAlign: "center", 
        //         fontStyle: "italic", 
        //     }
        // }

        return (
            <ChatMsg
                key={index}
                avatar={''}
                side={side}
                messages={[
                    obj.content,
                ]}
                style={{
                    textAlign: "center", 
                    fontStyle: "italic", 
                }}
            />
        )
    })

    const sendMessage = () => {
        if (message !== null && message !== '') {
            const msg = {
                content: message,
                sender_id: myID,
            }
            socketRef.current.emit('sendDataClient', msg, room);
            setMessage('');
        }
    }

    return (
        <Box
            className="boxChat"
            sx={{
                width: "90%",
                height: "100vh",
                margin: "0 auto",
                marginTop: 0,
                boxShadow: "0 0 10px 0 black",
            }}
        >
            <Box
                className="boxChatMessage"
                sx={{
                    minHeight: "90vh", 
                    maxHeight: "90vh", 
                    overflowX: "hidden",
                    overflowY: "auto",
                }}
            >
                <ChatMsg
                    avatar={''}
                    side={'left'}
                    messages={[
                        'Hi Jenny, How r u today?',
                        'Did you train yesterday',
                    ]}
                />
                {renderAllMessages}
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
                    //display: "flex",
                    bottom: 0,
                }}
            >
                <TextareaAutosize
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
                    variant="contained" 
                    endIcon={<SendIcon />}
                    onClick={sendMessage}
                >
                    Send
                </Button>
            </Box>
        </Box>
    )
} 