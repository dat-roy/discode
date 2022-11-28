import React, { Fragment } from "react";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../../../store/hooks";
import { useSocket } from "../../../../store/hooks";

import {
    Box, Stack, TextField,
    Button, Typography, IconButton, InputAdornment, Avatar,
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

import { MessageTypes } from "../../../../types/db.type"
import {
    handleCreateNewSingleRoomAPI,
    handleGetOldMessagesAPI, handleSaveNewMessageAPI, handleMarkReadMessagesAPI,
    handleGetReadStatusAPI,
} from "../../../../services";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InnerInbox({ myID, otherUser, commonRoom, setCommonRoom }) {
    const params = useParams();

    const [state,] = useStore();
    const [socketState,] = useSocket();
    const socket = socketState.instance;
    const latestMessage = useRef();
    let message = useRef();

    const [allMessages, setAllMessages] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [emojiMartDisplay, setEmojiMartDisplay] = useState(false);
    const [seen, setSeen] = useState(false);

    const scrollToBottom = () => {
        latestMessage.current.scrollIntoView({ behavior: "smooth" });
    }

    //Auto scroll to bottom when having a new message.
    useEffect(() => {
        scrollToBottom();
    }, [allMessages])

    //Reset when changing between routes.
    useEffect(() => {
        message.current.value = '';
        setAllMessages([]);
        setImageFile(null);
        setImageBase64(null);
        setSeen(false);
    }, [params])

    useEffect(() => {
        if (commonRoom?.room_id) {
            socket.on('seenMessage', (userId, roomId) => {
                if (roomId === commonRoom?.room_id && userId === otherUser?.id) {
                    setSeen(true);
                }
            })
        }
        return () => {
            socket.off('seenMessage')
        }
    }, [commonRoom?.room_id])

    //Handle receiving message from socket.
    useEffect(() => {
        if (commonRoom?.room_id) {
            socket.on('receiveChatMessage', (newMsg, roomId) => {
                if (roomId === commonRoom?.room_id
                    && parseInt(params?.id) === parseInt(newMsg.sender_id)) {
                    setAllMessages(oldMsgs => [...oldMsgs, newMsg]);
                    socket.emit("readMessage", state.user.id, commonRoom?.room_id)
                }
            })
        }
        return () => {
            socket.off('receiveChatMessage');
        }
    }, [commonRoom?.room_id]);

    //Get old messages.
    useEffect(() => {
        if (commonRoom?.room_id) {
            handleGetOldMessagesAPI(myID, commonRoom.room_id)
                .then(res => {
                    if (res.status !== 200) {
                        throw new Error(res.message)
                    }
                    setAllMessages(res.data.messages);
                })
                .catch(err => {
                    return toast.error(err.message)
                })
        }
    }, [myID, commonRoom?.room_id])

    //Mark all messages as read.
    useEffect(() => {
        if (commonRoom?.room_id) {
            handleMarkReadMessagesAPI(state.user.id, commonRoom?.room_id)
                .then((res) => {
                    if (!res.data?.result?.affectedRows) return;
                    socket.emit("readMessage", state.user.id, commonRoom?.room_id)
                })
        }
    }, [params, commonRoom?.room_id, state.user.id, socket])

    //Get seen status of member(s).
    useEffect(() => {
        if (commonRoom?.room_id) {
            //Check last message only.
            handleGetReadStatusAPI(state.user.id, commonRoom?.room_id)
                .then((res) => {
                    const users = res.data?.users;
                    if (users.find(user => user.id === otherUser?.id)) {
                        setSeen(true)
                    }
                })
        }
    }, [commonRoom?.room_id, state.user.id, otherUser?.id])

    const renderAllMessages = allMessages.map((obj, index) => {
        const side = (!obj.sender_id)
            ? "center"
            : (obj.sender_id === myID)
                ? "right" : "left";

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
            }

            if (commonRoom) {
                handleSaveNewMessageAPI(formData)
                    .then(res => {
                        if (res.status !== 200) {
                            throw new Error(res.message);
                        }
                        const { msg_data } = res.data;
                        socket.emit('sendChatMessage', msg_data, commonRoom.room_id);
                        message.current.value = '';
                        setSeen(false);
                        setAllMessages(oldMsgs => [...oldMsgs, msg_data]);
                        setImageBase64(null);
                        scrollToBottom();
                    })
                    .catch(err => {
                        return toast.error(err.message);
                    })
            }
        }
    }

    const handleCreateNewRoom = async () => {
        const response = await handleCreateNewSingleRoomAPI(myID, otherUser.id)

        if (response.status === 200) {
            const newRoom = response.data.room_data[0]
            //TODO: Replace by a gif or sticker.
            const msg = {
                message_type: MessageTypes.TEXT,
                sender_id: myID,
                room_id: newRoom.room_id,
                content: "HELLO HELLO",
                parent_message_id: null,
            }

            let formData = new FormData();
            formData.append("document", JSON.stringify(msg))

            handleSaveNewMessageAPI(formData)
                .then(res => {
                    if (res.status !== 200) {
                        return new Error(res.message)
                    }
                    setCommonRoom(newRoom);
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
            key="boxChat"
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
                    height: 60,
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
                {(() => {
                    if ((allMessages[allMessages.length - 1])?.sender_id === state.user.id) {
                        return seen
                        ? <>
                            Seen:
                            <Avatar
                                src={otherUser?.avatar_url}
                                style={{ width: 20, height: 20, }}
                            />
                        </> : <>Not seen</>
                    }
                })()}
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
                                                //console.log(e);
                                                message.current.value += e.native;
                                            }}
                                            emojiButtonSize={40}
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