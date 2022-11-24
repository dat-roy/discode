import React from "react"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../../../store/hooks";
import { useSocket } from "../../../../store/hooks";

import { Box, Stack, Typography } from "@mui/material"
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { IconButton } from "@mui/material";
import SearchBar from "../../../../components/SearchBar"
import { handleGetChannelByIdAPI, handleGetChannelMembers } from "../../../../services/chat";

export default function ChannelDetail() {
    const params = useParams();
    const [state,] = useStore();
    const [socketState,] = useSocket();
    const socket = socketState.instance;
    const channel_id = parseInt(params.id);
    const [members, setMembers] = useState([]);
    const [onlineId, setOnlineId] = useState([])
    const [adminId, setAdminId] = useState(null);
    useEffect(() => {
        handleGetChannelByIdAPI(state.user.id, channel_id)
            .then(res => {
                //console.log(res.data?.channel?.admin_id);
                setAdminId(res.data?.channel?.admin_id)
            })
        handleGetChannelMembers(channel_id)
            .then(res => {
                //console.log(res);
                setMembers(res.data?.members);
            })
    }, [state.user.id, channel_id])

    useEffect(() => {
        socket.emit("requestOnlineUsers", members.map(member => member.user_id));
    }, [socket, members])

    useEffect(() => {
        socket.on("receiveOnlineUsers", online => {
            //console.log(online);
            setOnlineId(online);
        })
    }, [socket])

    useEffect(() => {
        socket.on("notifyOnline", user_id => {
            if (!onlineId.includes(user_id)) {
                //TODO: fix redundant calling.
                //console.log("Doesn't exist")
                //console.log(onlineId, " ", user_id)
                setOnlineId(old => [...new Set([...old, user_id])]);
            }
        })

        socket.on("notifyOffline", user_id => {
            console.log("Offline")
            //console.log(onlineId);
            setOnlineId(old => old.filter(id => id !== user_id))
        })
    }, [socket])

    return (
        <Stack
            sx={{
                width: "auto",
                height: "100vh",
                maxHeight: "100vh",
                margin: "0 auto",
            }}
        >
            <Stack
                pt={3}
                direction="row"
                width="100%"
                alignItems={"center"}
                justifyContent={"center"}
            >
                <SearchBar placeholder={"Search members..."} style={{ width: "30%" }} />

                <Stack
                    direction="row"
                    spacing={-1}
                >
                    <IconButton
                        size="large" color="inherit"
                    >
                        <NotificationsIcon />
                    </IconButton>
                    <IconButton
                        size="large" color="inherit"
                    >
                        <SettingsIcon />
                    </IconButton>
                </Stack>
            </Stack>

            <Stack>
                <Typography>Admin:</Typography>
                <Stack>
                    <Box>
                        {(members.find(member => member.user_id === adminId))?.username}
                    </Box>
                </Stack>
            </Stack>

            <Stack>
                <Typography>Online:</Typography>
                <Stack>
                    {
                        onlineId
                            .filter(memberId => memberId !== adminId)
                            .map((memberId, index) => {
                                const member = members.find(member => member.user_id === memberId)
                                return <Box key={index}>
                                    {member.username}
                                </Box>
                            })
                    }
                </Stack>
            </Stack>

            <Stack>
                <Typography>Offline:</Typography>
                <Stack>
                    {
                        members
                            .filter(member => !onlineId.includes(member.user_id))
                            .map((member, index) => {
                                return <Box key={index}>
                                    {member.username}
                                </Box>
                            })
                    }
                </Stack>
            </Stack>
        </Stack>
    )
}