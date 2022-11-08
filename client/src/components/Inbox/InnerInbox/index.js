import React from "react";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
//import { useStore } from "../../../store/hooks";

import {
    Box, Stack, TextField,
    Button, Typography, IconButton, InputAdornment
} from "@mui/material";
import ChatMsg from '../../ChatMsg';
import SendIcon from '@mui/icons-material/Send';
import VideocamIcon from '@mui/icons-material/Videocam';
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';

import BadgeAvatar from "../../BadgeAvatar"

import { handleGetOldMessages, handleSaveNewMessage } from "../../../services/message";
import { MessageTypes } from "../../../types/db.type"
import { handleCreateNewSingleRoomAPI } from "../../../services";

const serverHost = "http://localhost:3030";

export default function InnerInbox({ myID, otherUser, commonRoom, setCommonRoom }) {
    const socketRef = useRef();
    const latestMessage = useRef();
    let message = useRef();

    //const [state, dispatch] = useStore();
    const [allMessages, setAllMessages] = useState([]);

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
            socketRef.current = io.connect(serverHost, { reconnection: false });
            socketRef.current.emit('joinRoom', commonRoom.room_id);
        }
    }, [commonRoom])

    useEffect(() => {
        if (commonRoom) {
            //Add a new message to oldMsg
            socketRef.current.on('sendDataServer', newMsg => {
                setAllMessages(oldMsgs => [...oldMsgs, newMsg]);
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
        if (message.current.value !== null && message.current.value !== '') {
            const msg = {
                content: message.current.value,
                sender_id: myID,
            }
            if (!commonRoom) {
                //Create new room, user_room, message, message_recipient.
                //Join room.
            } else {
                setAllMessages(oldMsgs => [...oldMsgs, msg]);
                socketRef.current.emit('sendDataClient', msg, commonRoom.room_id);
                const message_type = MessageTypes.TEXT;
                handleSaveNewMessage({
                    sender_id: msg.sender_id,
                    room_id: commonRoom.room_id,
                    content: msg.content,
                    message_type: message_type,
                    parent_message_id: null,
                })
                    .then(response => {
                        console.log(response);
                    })
            }
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
                    setCommonRoom(newRoom);
                })
        }
    }

    return (
        <Stack
            className="boxChat"
            sx={{
                width: "auto",
                height: "100vh",
                maxHeight: "100vh",
                margin: "0 auto",
            }}
        >
            <Box
                className="boxChatHeader"
                sx={{
                    height: 100,
                    width: "100%",
                    bgcolor: "inherit",
                }}
            >
                <Stack
                    alignItems={"center"}
                    direction="row"
                    justifyContent={"space-between"}
                    sx={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Stack
                        direction={"row"}
                        spacing={2}
                        marginLeft={3}
                    >
                        <BadgeAvatar
                            online={true}
                            alt={otherUser.username}
                            src={otherUser.avatar_url}
                        />
                        <Stack
                            spacing={0.2}
                        >
                            <Typography variant="subtitle2">
                                @{otherUser.username}
                            </Typography>
                            <Typography variant="caption">
                                Online
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack
                        direction="row"
                        alignItems={"center"}
                        spacing={3}
                        marginRight={2}
                    >
                        <IconButton
                            size="large" color="inherit"
                        >
                            <VideocamIcon />
                        </IconButton>
                    </Stack>
                </Stack>
            </Box>
            <Box
                className="boxChatMessage"
                sx={{
                    width: "100%",
                    flexGrow: 1,
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
                    width: "100%",
                    //bgcolor: "#000",
                }}
            >
                <Stack
                    direction="row"
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    spacing={3}
                    padding={1}
                    marginLeft={2}
                    marginRight={2}
                >
                    <TextField
                        disabled={(commonRoom) ? false : true}
                        fullWidth
                        multiline
                        placeholder="Write a message..."
                        variant="filled"
                        inputRef={message}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.shiftKey === false) {
                                sendMessage()
                                console.log(message.current.value)
                                message.current.value = ''
                            }
                        }}
                        InputProps={{
                            inputProps: {
                                style: {
                                    color: "white",
                                }
                            },
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton
                                        sx={{
                                            color: "white",
                                        }}
                                    >
                                        <SentimentSatisfiedRoundedIcon />
                                    </IconButton>
                                </InputAdornment>
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
                </Stack>
            </Box>
        </Stack>
    )
}