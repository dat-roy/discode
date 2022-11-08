import React from "react";
import { useState, useEffect } from "react";
import { handleGetJoinedSingleRoomsAPI } from "../../../services";
import { useStore } from "../../../store/hooks"

import { Box, Stack } from "@mui/system";
import { Typography } from "@mui/material";
import { Badge } from "@mui/material";
import { IconButton } from "@mui/material";
import { Link } from "@mui/material";
import Divider from '@mui/material/Divider';
import CreateIcon from '@mui/icons-material/Create';
import SearchBar from "../../../components/SearchBar";
import BadgeAvatar from "../../../components/BadgeAvatar";

const ChatElement = ({
    index, selected, setSelected,
    id, username, online, avatar_url, new_messages_count,
    last_message, sender_id, time, is_read,
}) => {
    const [state, dispatch] = useStore();

    let mycolor = "#263238"
    if (selected === index) {
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
            onClick={() => { setSelected(index) }}
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
                        online={online}
                        alt={username}
                        src={avatar_url}
                    />
                    <Stack spacing={0.4}
                        style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: '11rem'
                        }}
                    >
                        <Typography variant="subtitle2">
                            @{username}
                        </Typography>
                        <Typography variant="caption" noWrap>
                            {
                                (state.user.id === sender_id)
                                && "You: "
                            }
                            {last_message}
                        </Typography>
                    </Stack>
                </Stack>
                <Stack spacing={2} alignItems="center">
                    <Typography
                        variant="caption"
                        sx={{ fontWeight: 600 }}
                    >
                        {time}
                    </Typography>

                    <Badge color="primary" badgeContent={new_messages_count} />
                </Stack>
            </Stack>
        </Box>

    )
}

export default function ChatList() {
    const [state, dispatch] = useStore();
    const [selected, setSelected] = useState(null);
    const [singleRooms, setSingleRooms] = useState([
        {
            id: 1,
            username: "datRoy",
            online: true,
            avatar_url: "",
            new_messages_count: 0,
            last_message: "How are you",
            sender_id: 5,
            time: "10:30",
            is_read: false,
        },
        {
            id: 1,
            username: "sakura",
            online: false,
            avatar_url: "",
            new_messages_count: 2,
            last_message: "かわいい",
            sender_id: 2,
            time: "10:30",
            is_read: false,
        }
    ])
    useEffect(() => {
        async function fetchData() {
            const result = await handleGetJoinedSingleRoomsAPI(state.user.id);
            let roomList = result.data.room_list || [];
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
                                index={index}
                                selected={selected}
                                setSelected={setSelected}
                                id={obj.id}
                                username={obj.username}
                                sender_id={obj.sender_id}
                                last_message={obj.last_message}
                                time={obj.time}
                                online={obj.online}
                                new_messages_count={obj.new_messages_count}
                            />
                        )
                    })
                }
            </Stack>
        </Box>
    )
} 