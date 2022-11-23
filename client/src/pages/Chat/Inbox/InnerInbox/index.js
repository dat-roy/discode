import React, { Fragment } from "react";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../../../store/hooks";
import { useSocket } from "../../../../store/hooks";

import {
    Box, Stack, TextField,
    Button, Typography, IconButton, InputAdornment,
} from "@mui/material";
import ChatMsg from '../../../../components/ChatMsg';
import SendIcon from '@mui/icons-material/Send';
import VideocamIcon from '@mui/icons-material/Videocam';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import BadgeAvatar from "../../../../components/BadgeAvatar"

import { handleGetOldMessages, handleSaveNewMessage } from "../../../../services/message";
import { MessageTypes } from "../../../../types/db.type"
import { handleCreateNewSingleRoomAPI } from "../../../../services";

export default function InnerInbox({ myID, otherUser, commonRoom, setCommonRoom }) {
    const params = useParams();

    const [state,] = useStore();
    const [socketState, ] = useSocket();
    const socket = socketState.instance;
    const latestMessage = useRef();
    let message = useRef();

    const [allMessages, setAllMessages] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [emojiMartDisplay, setEmojiMartDisplay] = useState(false);

    const scrollToBottom = () => {
        latestMessage.current.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [allMessages])

    useEffect(() => {
        message.current.value = '';
        setImageBase64(null);
    }, [params])

    useEffect(() => {
        if (commonRoom?.room_id) {
            handleGetOldMessages(myID, commonRoom.room_id)
                .then(res => {
                    //console.log(res.data.messages);
                    setAllMessages(res.data.messages);
                })
        }
    }, [myID, commonRoom?.room_id])

    useEffect(() => {
        if (commonRoom?.room_id) {
            socket.emit('addUser', state.user.id);
            socket.emit('joinChatRoom', commonRoom.room_id);
        }
    }, [socket, commonRoom?.room_id, state.user.id])

    useEffect(() => {
        //Note: fix duplicate new message
        if (commonRoom?.room_id) {
            //Add a new message to oldMsg
            socket.on('receiveChatMessage', newMsg => {
                if (newMsg.sender_id !== state.user.id) {
                    setAllMessages(oldMsgs => [...oldMsgs, newMsg]);
                }
            })
        }
    }, [socket, commonRoom?.room_id, state.user.id]);

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
                canClickAvatar={false}
                side={side}
                messageObj={obj}
            />
        )
    })

    const sendMessage = () => {
        if ((message.current?.value && message.current?.value !== '')
            || ((!message.current?.value || message.current?.value === '') && imageBase64)) {
            const msg = {
                message_type: (imageBase64) ? MessageTypes.IMAGE : MessageTypes.TEXT,
                sender_id: myID,
                room_id: commonRoom.room_id,
                content: message.current?.value,
                parent_message_id: null,
            }

            let formData = new FormData();
            formData.append("document", JSON.stringify(msg))
            if (imageBase64) {
                formData.append("file", imageFile);
                // console.log(formData);
            }

            if (commonRoom) {
                setAllMessages(oldMsgs => [...oldMsgs, { ...msg, message_attachments: imageBase64 }]);
                socket.emit('sendChatMessage',
                    { ...msg, message_attachments: imageBase64 }, commonRoom.room_id);
                handleSaveNewMessage(formData)
                    .then(response => {
                        //console.log(response);
                        message.current.value = '';
                        setImageBase64(null);
                        scrollToBottom();
                    })
            }
        }
    }

    const handleCreateNewRoom = async () => {
        const response = await handleCreateNewSingleRoomAPI(myID, otherUser.id)

        if (response.status === 200) {
            const newRoom = response.data.room_data[0]
            const msg = {
                message_type: MessageTypes.TEXT,
                sender_id: myID,
                room_id: newRoom.room_id,
                content: "HELLO HELLO",
                parent_message_id: null,
            }

            let formData = new FormData();
            formData.append("document", JSON.stringify(msg))

            handleSaveNewMessage(formData)
                .then(response => {
                    //console.log(response);
                    setCommonRoom(newRoom);
                })
        }
    }

    const handleUploadClick = (event) => {
        let file = event.target.files[0];
        setImageFile(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = (e) => {
            setImageBase64(reader.result)
            //console.log(reader.result);
        }
    }

    return (
        <Stack
            key="boxChat"
            sx={{
                width: "auto",
                height: "100vh",
                maxHeight: "100vh",
                margin: "0 auto",
            }}
        >
            <Box
                key="boxChatHeader"
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
                key="boxChatMessage"
                sx={{
                    width: "92%",
                    flexGrow: 1,
                    overflowX: "hidden",
                    overflowY: "auto",
                    padding: 3,
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
                {renderAllMessages}
                <Box
                    style={{
                        float: "left",
                        clear: "both",
                        marginBottom: 10,
                    }}
                    ref={latestMessage}
                />
            </Box>

            <Box
                key="sendBox"
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
                                message.current.value = ''
                            }
                        }}

                        sx={{
                            ".MuiOutlinedInput-root": {
                                paddingTop: "1rem",
                                flexDirection: "column"
                            },
                            img: {
                                paddingRight: "1rem"
                            }
                        }}
                        InputProps={{
                            inputProps: {
                                style: {
                                    color: "white",
                                }
                            },
                            startAdornment:
                                <Fragment>
                                    {
                                        imageBase64
                                            ? <Stack
                                                position="relative"
                                                style={{
                                                    width: 180,
                                                    paddingRight: 20,
                                                }}
                                            >
                                                <img alt="uploaded" src={imageBase64} style={{ width: "100%" }} />
                                                <IconButton
                                                    sx={{
                                                        position: "absolute",
                                                        color: "yellow",
                                                        top: -15,
                                                        right: 4,
                                                    }}
                                                    component="label"
                                                    onClick={() => setImageBase64(null)}
                                                >
                                                    <HighlightOffIcon />
                                                </IconButton>
                                            </Stack>
                                            : <InputAdornment
                                                position="end"
                                                style={{
                                                    paddingRight: 15,
                                                }}
                                            >

                                                <IconButton
                                                    sx={{
                                                        color: "white",
                                                    }}
                                                    component="label"
                                                >
                                                    <input hidden accept="image/*" type="file" alt="Image Upload"
                                                        onChange={handleUploadClick}
                                                    />
                                                    <PhotoCamera />
                                                </IconButton>
                                            </InputAdornment>
                                    }
                                </Fragment>,

                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton
                                        sx={{
                                            color: "white",
                                            position: "relative"
                                        }}
                                        onClick={() => { setEmojiMartDisplay(!emojiMartDisplay) }}
                                    >
                                        <SentimentSatisfiedRoundedIcon />
                                    </IconButton>
                                    <Box
                                        sx={{
                                            zIndex: 1000,
                                            position: "absolute",
                                            marginRight: 5,
                                            bottom: 65,
                                            display: (emojiMartDisplay) ? "block" : "none",
                                        }}
                                    >
                                        <Picker
                                            data={data}
                                            onEmojiSelect={(e) => {
                                                console.log(e);
                                                message.current.value += e.native;
                                            }}
                                            emojiButtonSize={30}
                                            emojiSize={20}
                                            onClickOutside={() => {
                                                if (emojiMartDisplay) {
                                                    setEmojiMartDisplay(!emojiMartDisplay)
                                                }
                                            }}
                                        />
                                    </Box>
                                </InputAdornment>,
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