import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import { useStore } from "../../store/hooks";

import { Box, TextareaAutosize, Button } from "@mui/material";
import ChatMsg from '../ChatMsg';
import SendIcon from '@mui/icons-material/Send';
import { handleGetUserByIdAPI } from "../../services";


const serverHost = "http://localhost:3030";

export default function Inbox() {
    const navigate = useNavigate();
    const params = useParams();

    const [state, dispatch] = useStore();
    const [otherUser, setOtherUser] = useState({});
    const [havingConversation, setHavingConversation] = useState(false);

    const myID = state.user.id;
    const otherID = params.id;
    console.log("My id: " + myID);
    console.log("Other id: " + otherID);

    useEffect(() => {
        if (otherID && otherID !== myID) {
            async function checkOtherID() {
                const response = await handleGetUserByIdAPI(otherID);
                if (!response) {
                    return navigate('/err/invalid-user-id')
                } else {
                    console.log(response);
                    setOtherUser(response.data.user_data);
                }
            }
            const result = checkOtherID()
        }
    }, [])

    if (!otherID || otherID === myID) {
        return (
            <div style={{padding: 20}}>
                <h3>Please select a conversation or create new one</h3>
            </div>
        )
    }
    return <InnerInbox
        myID={myID}
        otherUser={otherUser}
        setOtherUser={setOtherUser}
    />
}

function InnerInbox({myID, otherUser, setOtherUser}) {
    const navigate = useNavigate();
    const socketRef = useRef();
    const latestMessage = useRef();

    const [state, dispatch] = useStore();
    const [allMessages, setAllMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [room, setRoom] = useState();

    useEffect(() => {
        socketRef.current = io.connect(serverHost);
        const param = 1;
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

        return (
            <ChatMsg
                key={index}
                avatar={otherUser.avatar_url}
                side={side}
                messages={[
                    obj.content,
                ]}
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
                <ChatMsg
                    avatar={otherUser.avatar_url}
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