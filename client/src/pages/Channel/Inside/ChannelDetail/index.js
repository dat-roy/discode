import React from "react"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../../../store/hooks";
import { useSocket } from "../../../../store/hooks";
import { Button, ButtonBase } from "@mui/material";
import { Avatar, Box, Stack, Typography } from "@mui/material"
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { IconButton } from "@mui/material";
import SearchBar from "../../../../components/SearchBar"
import {
    handleGetChannelByIdAPI,
    handleGetChannelMembersAPI,
} from "../../../../services";
import "../../../../styles/modal.css"
import InvitePeopleModal from "./InvitePeopleModal";

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
                setAdminId(res.data?.channel?.admin_id)
            })
        handleGetChannelMembersAPI(channel_id)
            .then(res => {
                setMembers(res.data?.members);
            })
    }, [state.user.id, channel_id])

    useEffect(() => {
        socket.emit("requestOnlineUsers", members.map(member => member.user_id));
    }, [socket, members])

    useEffect(() => {
        socket.on("receiveOnlineUsers", online => {
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
            setOnlineId(old => old.filter(id => id !== user_id))
        })
    }, [socket])

    return (
        <Stack
            style={{
                width: "100%",
                height: "100vh",
                maxHeight: "100vh",
            }}
        >
            <Stack
                direction="row"
                alignItems={"center"}
                justifyContent={"space-between"}
                style={{
                    width: "100%",
                    height: 78,
                }}
                spacing={-2}
            >
                <Stack>
                    <SearchBar placeholder={"Search members..."} />
                </Stack>

                <Stack
                    direction="row"
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

            <Stack
                style={{
                    flexGrow: 1,
                    paddingLeft: 22,
                    paddingRight: 22,
                    overflowX: "hidden",
                    overflowY: "scroll",
                }}
            >
                <Stack direction="row" alignItems={"center"} justifyContent={"space-between"}>
                    <Typography>Members ({members.length}): </Typography>
                    <InvitePeopleModal
                        channel_id={channel_id}
                    />
                </Stack>
                <Stack
                    style={{
                        border: "1px solid red",
                    }}
                >
                    <Typography>Admin</Typography>
                    <Member
                        member={(members.find(member => member.user_id === adminId))}
                    />
                </Stack>
                <Stack
                    style={{
                        border: "1px solid red",
                    }}
                >
                    <Typography>
                        Online
                        ({onlineId.filter(memberId => memberId !== adminId).length})
                    </Typography>
                    {
                        onlineId
                            .filter(memberId => memberId !== adminId)
                            .map((memberId, index) => {
                                const member = members.find(member => member.user_id === memberId)
                                return <Member
                                    key={index}
                                    member={member}
                                />
                            })
                    }
                </Stack>
                <Stack
                    style={{
                        border: "1px solid red",
                    }}
                >
                    <Typography>
                        Offline
                        ({members.filter(member => !onlineId.includes(member.user_id)).length})
                    </Typography>
                    {
                        members
                            .filter(member => !onlineId.includes(member.user_id))
                            .map((member, index) => {
                                return <Member
                                    key={index}
                                    member={member}
                                />
                            })
                    }
                </Stack>
            </Stack>

            <Stack
                alignItems={"center"}
                justifyContent={"center"}
                style={{
                    height: 75,
                }}
            >
                <Button>Leave Channel</Button>
            </Stack>
        </Stack>
    )
}

function Member({ member }) {
    return (
        <Box
            component={ButtonBase}
            underline="none"
            sx={{
                '&:hover': {
                    backgroundColor: "white",
                    color: "red",
                }
            }}
        >
            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"start"}
                spacing={2}
                sx={{
                    width: "100%",
                    padding: 1.2,
                }}
            >
                <Avatar
                    src={member?.avatar_url}
                />
                <Stack
                    alignItems={"flex-start"}
                >
                    <Typography variant="subtitle1"><strong>{member?.username}</strong></Typography>
                    <Typography variant="caption">Last visit: 20:10</Typography>
                </Stack>
            </Stack>
        </Box>

    )
}