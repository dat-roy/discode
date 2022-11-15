import React from "react";
import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { handleGetJoinedSingleRoomsAPI, handleGetLastMessageAPI, handleGetUnreadMessagesAPI } from "../../../services";
import { useStore } from "../../../store/hooks"

import { Box, Stack } from "@mui/system";
import { Typography } from "@mui/material";
import { Badge } from "@mui/material";
import { IconButton } from "@mui/material";
import { Link } from "@mui/material";
import { Divider } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import SearchBar from "../../../components/SearchBar";
import BadgeAvatar from "../../../components/BadgeAvatar";

const ChatElement = ({ selected, setSelected, room_data }) => {
    const [state, dispatch] = useStore();
    const navigate = useNavigate();

    const {
        room_id, last_message, unread_messages, partner_data
    } = room_data;

    const last_message_time = last_message?.created_at.split(' ')[1].substr(0, 5);
    //console.log(last_message);

    let mycolor = "#263238"
    if (selected === room_id) {
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
                }
            }}
            onClick={() => {
                navigate(`/chat/${partner_data.id}`, {
                    state: {
                        selected_room_id: room_id,
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
                >
                    <BadgeAvatar
                        online={true}
                        alt={partner_data.username}
                        src={partner_data.avatar_url}
                    />
                    <Stack spacing={0.4}
                        style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: '11rem'
                        }}
                    >
                        <Typography variant="subtitle2">
                            @{partner_data.username}
                        </Typography>
                        <Typography variant="caption" noWrap>
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

                    <Badge color="primary" badgeContent={unread_messages.length} />
                </Stack>
            </Stack>
        </Box>

    )
}

export default function ChatList() {
    const location = useLocation();
    const [state, dispatch] = useStore();
    const [selected, setSelected] = useState(location.state?.selected_room_id || null);
    const [singleRooms, setSingleRooms] = useState([])

    useEffect(() => {
        setSelected(location.state?.selected_room_id || null);
    }, [location])

    useEffect(() => {
        async function fetchData() {
            const result = await handleGetJoinedSingleRoomsAPI(state.user.id, true);
            const roomList = result.data.room_list || [];

            for (const room of roomList) {
                const lastMsgRes = await handleGetLastMessageAPI(state.user.id, room.room_id);
                const unreadMsgRes = await handleGetUnreadMessagesAPI(state.user.id, room.room_id);
                room.last_message = lastMsgRes.data.last_message || null;
                //console.log(lastMsgRes.data.last_message || null);
                room.unread_messages = unreadMsgRes.data.unread_messages || [];
            }

            //Sort roomList:
            roomList.sort((a, b) => {
                return new Date(a.last_message.created_at) - new Date(b.last_message.created_at);
            })

            //console.log(roomList);
            setSingleRooms(roomList);
        }
        fetchData();
    }, [state.user.id])

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
                    <Divider
                        variant="middle" flexItem
                        color={"gray"}
                    />
                </Box>
            </Stack>

            <Stack
                direction="column"
                p={3}
                spacing={2}
                flexGrow={1}
                sx={{
                    height: "100vh",
                    overflowY: "scroll"
                }}
            >
                {
                    singleRooms.map((obj, index) => {
                        return (
                            <ChatElement
                                key={index}
                                selected={selected}
                                setSelected={setSelected}
                                room_data={obj}
                            />
                        )
                    })
                }
            </Stack>
        </Box>
    )
} 