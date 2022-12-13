import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Avatar, Button, Grid, IconButton, Stack, Typography } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ChannelModal from "../../components/ChannelModal";
import NoData from "../../components/NoData";
import { handleGetGlobalNotisAPI, handleMarkAllNotiAsReadAPI, handleMarkOneNotiAsReadAPI, handleReplyInvitationAPI } from "../../services";
import { NotiActionTypes } from "../../store/actions/constants";
import { useNoti, useStore } from "../../store/hooks";
import { ChannelNotificationTypes, PostNotificationTypes } from "../../types/db.type";

export default function Notification() {
    const [state,] = useStore();
    const [postNotis, setPostNotis] = useState([])
    const [channelNotis, setChannelNotis] = useState([])
    const [, notiDispatch] = useNoti();

    useEffect(() => {
        Promise.all([
            handleGetGlobalNotisAPI(state.user.id, 'post'),
            handleGetGlobalNotisAPI(state.user.id, 'channel'),
        ])
            .then(results => {
                console.log(results)
                setPostNotis(results[0].data?.notis);
                setChannelNotis(results[1].data?.notis);
            })
            .catch(err => {
                toast.error(err.message);
            })
    }, [state.user.id])

    return (
        <Stack height={"100vh"}
            borderLeft={"1px solid #3E4042"}
        >
            <Stack
                height={"94vh"}

                p={16}
                pt={4}
                pb={1}
                mb={8}
                style={{
                    overflowY: "scroll",
                }}
            >
                <Typography variant="h5" fontWeight={600} style={{ color: "lightorange" }}>Notifications</Typography>
                <Grid container spacing={2} justifyContent="center" mt={3}>
                    <Grid item xs={7.5}>
                        <Stack
                            spacing={2}
                            p={3}
                            style={{
                                height: "100%",
                                backgroundColor: "#11273c",
                                borderRadius: 10,
                            }}
                        >
                            <Stack
                                direction={"row"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                            >
                                <Typography variant={"h6"}>General</Typography>
                                <Button
                                    onClick={() => {
                                        const unread_general = (postNotis.filter(noti => noti.status === 0)).length;
                                        if (unread_general === 0) return;
                                        handleMarkAllNotiAsReadAPI(state.user.id, 'post',
                                            [
                                                PostNotificationTypes.POST_COMMENTS,
                                            ]
                                        )
                                            .then(() => {
                                                notiDispatch({
                                                    type: NotiActionTypes.DECREASE,
                                                    payload: {
                                                        badge: { notification: unread_general, }
                                                    }
                                                })
                                            })
                                            .catch(err => {
                                                console.error(err.message);
                                            })
                                    }}
                                >Mark all as read</Button>
                            </Stack>
                            <Stack>
                                {
                                    (postNotis.length === 0)
                                        ? <NoData />
                                        : postNotis.map((noti, index) => {
                                            return <GeneralNotiElem
                                                key={index}
                                                noti={noti}
                                            />
                                        })
                                }
                            </Stack>
                        </Stack>
                    </Grid>

                    <Grid item xs>
                        <Stack
                            spacing={2}
                            p={3}
                            style={{
                                height: "100%",
                                backgroundColor: "#11273c",
                                borderRadius: 10,
                            }}
                        >
                            <Stack
                                direction={"row"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                            >
                                <Typography variant={"h6"}>Channel</Typography>
                                <Button
                                    onClick={() => {
                                        const unread_channel = (channelNotis.filter(noti => noti.status === 0)).length;
                                        if (unread_channel === 0) return;
                                        console.log("Hello")
                                        handleMarkAllNotiAsReadAPI(state.user.id, 'channel',
                                            [
                                                ChannelNotificationTypes.CHANNEL_DECLINED,
                                                ChannelNotificationTypes.CHANNEL_REQUEST,
                                            ]
                                        )
                                            .then(() => {
                                                notiDispatch({
                                                    type: NotiActionTypes.DECREASE,
                                                    payload: {
                                                        badge: { notification: unread_channel, }
                                                    }
                                                })

                                                setChannelNotis(old => old.map(elem => {
                                                    elem.status = 1;
                                                    return elem;
                                                }))
                                            })
                                            .catch(err => {
                                                console.error(err.message);
                                            })
                                    }}
                                >Mark all as read</Button>
                            </Stack>
                            <Stack>
                                {
                                    (channelNotis.length === 0)
                                        ? <NoData />
                                        : channelNotis.map((noti, index) => {
                                            return <ChannelNotiElem
                                                key={index}
                                                noti={noti}
                                            />
                                        })
                                }
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </Stack>
    )
}

function NotiElemWrapper({ children, onClick, noti, notiId }) {
    const [state,] = useStore();
    const [, notiDispatch] = useNoti();
    const [read, setRead] = useState(noti?.status);
    useEffect(() => {
        setRead(noti?.status);
    }, [noti?.status])
    return (
        <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-around"}
            spacing={3}
            onClick={onClick}
            p={1.6} pt={0} pb={0}
            mb={2}
            sx={{
                borderRadius: 2,
                minHeight: 72,
                color: (read) ? "#B0B3B8" : "inherit",
                backgroundColor: (read) ? "inherit" : "rgb(91 177 214 / 10%)",
                '&:hover': {
                    borderRadius: 2,
                    backgroundColor: "rgba(222, 221, 221, 0.3)",
                    cursor: "pointer",
                }
            }}
        >
            {children}
            {(read) ? null
                : <FiberManualRecordIcon
                    style={{ color: "#2e89ff", fontSize: 14, }}
                />}
            <Stack>
                <IconButton
                    onClick={(event) => {
                        event.stopPropagation();
                        handleMarkOneNotiAsReadAPI(state.user.id, notiId)
                            .then(() => {
                                setRead(true);
                                notiDispatch({
                                    type: NotiActionTypes.DECREASE,
                                    payload: {
                                        badge: { notification: 1, }
                                    }
                                })
                            })
                            .catch(err => {
                                return toast.error(err.message);
                            })
                    }}
                >
                    <MoreHorizIcon style={{ color: "gray", fontSize: 30, }} />
                </IconButton>
            </Stack>
        </Stack>
    )
}

function GeneralNotiElem({ noti }) {
    const navigate = useNavigate();
    const sender = noti?.sender_data
    return (
        <NotiElemWrapper
            onClick={() => {
                navigate(`/posts/view/${noti?.comment_data?.post_id}`)
            }}
            noti={noti}
        >
            <Link to={`/profile?username=${sender?.username}`}
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >
                <Avatar
                    src={sender?.avatar_url}
                    style={{
                        width: 55,
                        height: 55,
                    }}
                />
            </Link>

            <Stack flexGrow={1} spacing={0.5}>
                <Typography variant={"body1"}>
                    {
                        (!noti?.is_reply)
                            ? <>
                                <span
                                    style={{
                                        color: "yellow"
                                    }}
                                >
                                    @{sender?.username}
                                </span> commented on one of your posts.
                            </>
                            : ``
                    }
                </Typography>
                <Typography variant={"caption"}>
                    {moment(noti?.created_at).fromNow()}
                </Typography>
            </Stack>
        </NotiElemWrapper>
    )
}

function ChannelNotiElem({ noti }) {
    const noti_type = noti?.noti_type;
    const sender = noti?.sender_data;
    const channel = noti?.channel_data

    const [state,] = useStore();
    const [openModal, setOpenModal] = useState(false);
    const handleClickInvitation = () => {
        setOpenModal(true);
    }

    const handleAcceptJoining = () => {
        handleReplyInvitationAPI(state.user.id, channel.id, noti.id, true)
            .then(res => {
                //console.log(res);
            })
            .catch(err => {
                return toast.error(err.message);
            })
    }
    const handleDeclineJoining = () => {
        handleReplyInvitationAPI(state.user.id, channel.id, noti.id, false)
            .then(res => {
                //console.log(res);
            })
            .catch(err => {
                return toast.error(err.message);
            })
    }
    switch (noti_type) {
        case ChannelNotificationTypes.CHANNEL_INVITE:
            return (
                <NotiElemWrapper onClick={handleClickInvitation}>
                    <Link to={`/profile?username=${sender?.username}`}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <Avatar
                            src={sender?.avatar_url}
                            style={{
                                width: 55,
                                height: 55,
                            }}
                        />
                    </Link>
                    <Stack flexGrow={1} spacing={0.5}>
                        <Typography
                            variant={"body2"}
                            style={{
                                wordWrap: "break-word",
                                maxWidth: "230px",
                            }}
                        >
                            <span style={{ color: "yellow" }}>
                                @{sender?.username}
                            </span> invited you to join <span style={{ color: "orange" }}>{channel.title}</span> channel.
                        </Typography>
                        <Typography variant={"caption"}>
                            {moment(noti?.created_at).fromNow()}
                        </Typography>
                    </Stack>
                    <ChannelModal
                        channel={channel}
                        openModal={openModal}
                        handleClose={e => {
                            e.stopPropagation();
                            setOpenModal(false);
                        }}
                        okText={"Accept"}
                        onOk={handleAcceptJoining}
                        cancelText={"Decline"}
                        onCancel={handleDeclineJoining}
                    />
                </NotiElemWrapper>
            )
        case ChannelNotificationTypes.CHANNEL_DECLINED:
            return (
                <NotiElemWrapper>
                    <Link to={`/profile?username=${sender?.username}`}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <Avatar
                            src={1}
                            style={{
                                width: 55,
                                height: 55,
                            }}
                        />
                    </Link>

                    <Stack flexGrow={1}>
                        <Typography
                            variant={"body2"}
                            style={{
                                wordWrap: "break-word",
                                maxWidth: "230px",
                            }}
                        >
                            Your request to join channel  was declined.
                        </Typography>
                    </Stack>
                </NotiElemWrapper>
            )
        default:
            return null;
    }
}