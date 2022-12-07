import React from "react"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../../../store/hooks";
import { useSocket } from "../../../../store/hooks";
import { Button, ButtonBase } from "@mui/material";
import { Box, Stack, Typography } from "@mui/material";
import BadgeAvatar from "../../../../components/BadgeAvatar"
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
                spacing={3}
                style={{
                    flexGrow: 1,
                    paddingLeft: 22,
                    paddingRight: 22,
                    overflowX: "hidden",
                    overflowY: "scroll",
                }}
            >
                <Stack direction="row" alignItems={"center"} justifyContent={"space-between"}>
                    <Typography
                        variant={"subtitle2"}
                        sx={{
                            textTransform: "uppercase",
                            color: "#ff5722", 
                        }}
                    >Members ({members.length}): </Typography>
                    <InvitePeopleModal
                        channel_id={channel_id}
                    />
                </Stack>
                <Stack>
                    <Typography
                        variant={"subtitle2"}
                        sx={{
                            textTransform: "uppercase",
                            pl: 1.3,
                            color: "#ff8a65",
                            fontWeight: 700,
                        }}
                    >Admin</Typography>
                    <Member
                        member={(members.find(member => member.user_id === adminId))}
                        online={true}
                    />
                </Stack>
                <Stack>
                    <Typography
                        variant={"subtitle2"}
                        sx={{
                            textTransform: "uppercase",
                            pl: 1.3,
                            color: "#81c784",
                        }}
                    >
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
                                    online={true}
                                />
                            })
                    }
                </Stack>
                <Stack>
                    <Typography
                        variant={"subtitle2"}
                        sx={{
                            textTransform: "uppercase",
                            pl: 1.3,
                            color: "#b2a852",
                        }}
                    >
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
                                    online={false}
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

function Member({ member, online }) {
    return (
        <Box
            component={ButtonBase}
            underline="none"
            sx={{
                '&:hover': {
                    backgroundColor: "rgb(91 177 214 / 10%)",
                    borderRadius: 2,
                    filter: "brightness(100%)",
                },
                ...(!online && { filter: "brightness(50%)" }),
            }}
        >
            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"start"}
                spacing={2}
                sx={{
                    width: "100%",
                    p: 1, pl: 1.2, pr: 1.2,
                }}
            >
                <BadgeAvatar
                    src={member?.avatar_url}
                    online={online}
                />
                <Stack
                    alignItems={"flex-start"}
                >
                    <Typography variant="subtitle1" sx={{ color: "#ffeb3b" }}><strong>@{member?.username}</strong></Typography>
                    <Typography variant="caption" sx={{ color: "lightgray" }}>Last visit: 20:10</Typography>
                </Stack>
            </Stack>
        </Box>

    )
}