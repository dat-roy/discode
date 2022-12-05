import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    handleGetJoinedSingleRoomsAPI,
    handleGetLastMessageAPI,
    handleGetUnreadMessagesAPI
} from "../../../services";
import { useNoti, useStore, useSocket } from "../../../store/hooks"
import moment from "moment"

import { Box, Stack } from "@mui/system";
import { Typography } from "@mui/material";
import { Badge } from "@mui/material";
import { IconButton } from "@mui/material";
import { Link } from "@mui/material";
import { Divider } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import SearchBar from "../../../components/SearchBar";
import BadgeAvatar from "../../../components/BadgeAvatar";
import { toast } from "react-toastify";
import { NotiActionTypes } from "../../../store/actions/constants";

export default function ChatList() {
    const params = useParams();
    const [state,] = useStore();
    const [, notiDispatch] = useNoti();
    const [socketState,] = useSocket();
    const socket = socketState.instance;
    const [selected, setSelected] = useState(parseInt(params?.id) || null);
    const [singleRooms, setSingleRooms] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const latestRoom = useRef();

    const scrollToTop = () => {
        latestRoom.current.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        setSelected(parseInt(params?.id) || null);
    }, [params?.id])

    //Set badge number to 0.
    useEffect(() => {
        if (singleRooms) {
            for (const room of singleRooms) {
                if (room.partner_data.id === selected) {
                    notiDispatch({
                        type: NotiActionTypes.DECREASE,
                        payload: {
                            badge: { message: room.unread_messages },
                        }
                    })
                    room.unread_messages = 0;
                }
            }
        }
    }, [selected, singleRooms])

    useEffect(() => {
        async function fetchData() {
            const result = await handleGetJoinedSingleRoomsAPI(state.user.id, true);
            const roomList = result.data.room_list || [];

            for (const room of roomList) {
                const lastMsgRes = await handleGetLastMessageAPI(state.user.id, room.room_id);
                const unreadMsgRes = await handleGetUnreadMessagesAPI(state.user.id, room.room_id);
                room.last_message = lastMsgRes.data.last_message || null;
                room.unread_messages = unreadMsgRes.data?.unread_messages?.length || 0;
            }

            //Sort roomList:
            roomList.sort((a, b) => {
                return new Date(b.last_message.created_at) - new Date(a.last_message.created_at);
            })
            scrollToTop();

            setSingleRooms(roomList);
        }
        fetchData()
            .catch(err => {
                toast.error(err.message);
            });
    }, [state.user.id])

    useEffect(() => {
        if (singleRooms) {
            socket.emit("requestOnlineUsers", singleRooms.map(room => room.partner_data.id))
        }
    }, [socket, singleRooms])

    useEffect(() => {
        socket.on("receiveOnlineUsers", online => {
            setOnlineUsers(online);
        })
        return () => {
            socket.off("receiveOnlineUsers");
        }
    }, [socket])

    useEffect(() => {
        socket.on("notifyOnline", user_id => {
            if (!singleRooms.includes(room => room.partner_data.id === user_id)) {
                setOnlineUsers(old => [...old, user_id]);
            }
        })

        socket.on("notifyOffline", user_id => {
            setOnlineUsers(old => old.filter(id => id !== user_id))
        })

        return () => {
            socket.off("notifyOnline")
            socket.off("notifyOffline")
        }
    }, [socket])

    useEffect(() => {
        if (singleRooms) {
            socket.on("receiveChatMessageAtChatList", newMsg => {
                console.log(selected)
                console.log(newMsg.sender_id)
                console.log(selected === newMsg.sender_id)
                if (selected !== newMsg.sender_id && state.user.id !== newMsg.sender_id) {
                    notiDispatch({
                        type: NotiActionTypes.INCREASE,
                        payload: {
                            badge: { message: 1 },
                        },
                    })
                }
                
                const roomList = singleRooms.map(room => {
                    if (room.room_id === newMsg.room_id) {
                        room.last_message = newMsg
                        if (newMsg.sender_id !== state.user.id) {
                            room.unread_messages++;
                        }
                    }
                    return room
                })
                //Sort roomList:
                roomList.sort((a, b) => {
                    return new Date(b.last_message.created_at) - new Date(a.last_message.created_at);
                })
                setSingleRooms(roomList)
                scrollToTop();
            })
        }
        return () => {
            socket.off("receiveChatMessageAtChatList")
        }
    }, [socket, singleRooms, selected])

    return (
        <Box>
            <Stack>
                <Stack
                    p={3}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 'bold',
                        }}
                    >
                        Chats
                    </Typography>
                    <IconButton
                        size="large" color="inherit"
                        style={{
                            marginRight: -10,
                        }}
                    >
                        <CreateIcon />
                    </IconButton>
                </Stack>

                <Stack>
                    <SearchBar placeholder={"Search..."} />
                </Stack>

                <Box
                    marginTop={3}
                    padding={1}
                >
                    <Divider variant="middle" color={"gray"} />
                </Box>
            </Stack>

            <Stack
                direction="column"
                p={3}
                spacing={2}
                flexGrow={1}
                sx={{
                    height: "70vh",
                    overflowY: "scroll"
                }}
            >
                <Box
                    style={{
                        float: "left",
                        clear: "both",
                        marginBottom: -12,
                    }}
                    ref={latestRoom}
                />
                {
                    singleRooms.map((obj, index) => {
                        return (
                            <ChatElement
                                key={index}
                                selected={selected}
                                online={(onlineUsers.includes(obj.partner_data.id)) ? true : false}
                                room_data={obj}
                            />
                        )
                    })
                }
            </Stack>
        </Box>
    )
}

function ChatElement({ selected, online, room_data }) {
    const [state,] = useStore();
    const navigate = useNavigate();

    const {
        last_message, partner_data, unread_messages,
    } = room_data;

    const last_message_time = (moment(last_message?.created_at).isSame(moment(), 'day'))
        ? last_message?.created_at?.split(' ')[1]?.substr(0, 5)
        : moment(last_message?.created_at).fromNow();

    let mycolor = "#263238"
    if (selected === partner_data.id) {
        mycolor = "#01579b"
    }
    return (
        <Box
            component={Link}
            underline="none"
            color="inherit"
            sx={{
                paddingLeft: 3,
                paddingRight: 3,
                borderRadius: 5,
                bgcolor: mycolor,
                '&:hover': {
                    bgcolor: "#607d8b",
                    cursor: "pointer",
                },
                pointerEvents: (selected === partner_data.id) ? "none" : "auto",
            }}
            onClick={() => {
                navigate(`/chat/${partner_data.id}`, {
                    state: {
                        partner_data: partner_data,
                    }
                })
            }}
        >
            <Stack
                width="100%"
                direction="row"
                alignItems={"center"}
                justifyContent="space-between"
                height="80px"
            >
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                >
                    <BadgeAvatar
                        online={online}
                        alt={partner_data.username}
                        src={partner_data.avatar_url}
                    />
                    <Stack spacing={0.4}
                        style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: '6rem'
                        }}
                    >
                        <Typography variant="subtitle1" color="#dce775">
                            @{partner_data.username}
                        </Typography>
                        <Typography variant="caption" noWrap marginTop={0}>
                            {
                                (state.user.id === last_message?.sender_id)
                                && "You: "
                            }
                            {
                                (last_message?.content)
                                    ? last_message.content : "[Image]"
                            }
                        </Typography>
                    </Stack>
                </Stack>
                <Stack spacing={2} alignItems="center">
                    <Typography
                        variant="caption"
                        sx={{ fontWeight: 600 }}
                    >
                        {last_message_time}
                    </Typography>

                    <Badge color="primary" badgeContent={unread_messages} />
                </Stack>
            </Stack>
        </Box>
    )
}