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

import {
    handleGetGroupRoomByIdAPI,
} from "../../../../services/chat";
import {
    handleGetOldMessages,
    handleSaveNewMessage,
} from "../../../../services/message";
import { MessageTypes } from "../../../../types/db.type"

import VideocamIcon from '@mui/icons-material/Videocam';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ChannelInbox() {
    const params = useParams();
    const [state,] = useStore();
    const [socketState,] = useSocket();
    const socket = socketState.instance;

    const room_id = parseInt(params.room_id);

    const latestMessage = useRef();
    let message = useRef();

    const [roomInfo, setRoomInfo] = useState(null);
    const [allMessages, setAllMessages] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [emojiMartDisplay, setEmojiMartDisplay] = useState(false);

    const scrollToBottom = () => {
        latestMessage.current.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        handleGetGroupRoomByIdAPI(room_id)
            .then(res => {
                setRoomInfo(res.data?.room)
            })
    }, [room_id])

    //Auto scroll to bottom when having a new message.
    useEffect(() => {
        scrollToBottom();
    }, [allMessages])

    useEffect(() => {
        message.current.value = '';
        setImageBase64(null);
    }, [params])

    useEffect(() => {
        handleGetOldMessages(state.user.id, room_id)
            .then(res => {
                setAllMessages(res.data.messages);
            })
    }, [state.user.id, room_id])

    useEffect(() => {
        socket.emit('addUser', state.user.id);
        socket.emit('joinChatRoom', room_id);
    }, [socket, state.user.id, room_id])

    useEffect(() => {
        //Add a new message to oldMsg
        socket.on('receiveChatMessage', newMsg => {
            if (newMsg.sender_id !== state.user.id) {
                setAllMessages(oldMsgs => [...oldMsgs, newMsg]);
            }
        })
    }, [socket, state.user.id, room_id]);

    const renderAllMessages = allMessages.map((obj, index) => {
        const side = (!obj.sender_id)
            ? "center"
            : (obj.sender_id === state.user.id)
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
                canClickAvatar={true}
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
                sender_id: state.user.id,
                room_id: room_id,
                content: message.current?.value,
                parent_message_id: null,
            }

            let formData = new FormData();
            formData.append("document", JSON.stringify(msg))
            if (imageBase64) {
                formData.append("file", imageFile);
            }

            handleSaveNewMessage(formData)
                .then(res => {
                    if (res.status !== 200) {
                        throw new Error("Failed to connect to server");
                    }
                    const { msg_data } = res.data;
                    socket.emit('sendChatMessage', msg_data, room_id);
                    message.current.value = '';
                    setAllMessages(oldMsgs => [...oldMsgs, msg_data]);
                    setImageBase64(null);
                    scrollToBottom();
                })
                .catch(err => {
                    return toast.error(err.message);
                })
        }
    }

    const handleUploadClick = (event) => {
        let file = event.target.files[0];
        setImageFile(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            setImageBase64(reader.result)
        }
    }

    return (
        <Stack
            key="groupChat"
            sx={{
                width: "auto",
                height: "100vh",
                maxHeight: "100vh",
                margin: "0 auto",
            }}
        >
            <ToastContainer
                position="top-center"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Box
                key="boxChatHeader"
                sx={{
                    height: 70,
                    width: "100%",
                    bgcolor: "#121858",
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
                        <Stack
                            spacing={0.2}
                            sx={{
                                paddingLeft: 1,
                            }}
                        >
                            <Typography variant="h6">
                                # {roomInfo?.title}
                            </Typography>
                            {/* <Typography variant="caption">
                                Created at: {roomInfo?.created_at}
                            </Typography> */}
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
                        disabled={!roomInfo?.removable ? true : false}
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
                                                    disabled={!roomInfo?.removable ? true : false}
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
                                                    disabled={!roomInfo?.removable ? true : false}
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
                                        disabled={!roomInfo?.removable ? true : false}
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
                        disabled={!roomInfo?.removable ? true : false}
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