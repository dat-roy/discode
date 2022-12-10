import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Button, Grid, IconButton, Stack, Typography } from "@mui/material"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { ChannelNotificationTypes } from "../../types/db.type";
import ChannelModal from "../../components/ChannelModal";
import { toast } from "react-toastify";
import { handleGetGlobalNotisAPI, handleMarkOneNotiAsReadAPI, handleReplyInvitationAPI } from "../../services";
import { useStore } from "../../store/hooks";
import moment from "moment";
import NoData from "../../components/NoData";

export default function Notification() {
    const [state,] = useStore();
    const [postNotis, setPostNotis] = useState([])
    const [channelNotis, setChannelNotis] = useState([])

    useEffect(() => {
        Promise.all([
            handleGetGlobalNotisAPI(state.user.id, 'post'),
            handleGetGlobalNotisAPI(state.user.id, 'channel'),
        ])
            .then(results => {
                //console.log(results);
                setPostNotis([...results[0].data?.notis, ...results[0].data?.notis, ...results[0].data?.notis, ...results[0].data?.notis]);
                setChannelNotis(results[1].data?.notis);
            })
            .catch(err => {
                toast.error(err.message);
            })
    }, [state.user.id])

    return (
        <Stack
            maxHeight={"94vh"}
            borderLeft={"1px solid #3E4042"}
            p={16}
            pt={4}
            pb={1}
            mb={8}
            style={{
                overflowY: "scroll",
            }}
        >
            <Typography variant="h5" fontWeight={600} style={{color: "lightorange"}}>Notifications</Typography>
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
                            <Button>Mark all as read</Button>
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
                            <Button>Mark all as read</Button>
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
    )
}

function NotiElemWrapper({ children, onClick, isRead }) {
    //const [state,] = useStore();
    const [read, setRead] = useState(isRead);
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
                        // handleMarkOneNotiAsReadAPI(state.user.id, notiId)
                        //     .then(() => {
                        //         setRead(true);
                        //     })
                        //     .catch(err => {
                        //         return toast.error(err.message);
                        //     })
                        setRead(old => !old);
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
            notiId={noti?.id}
            isRead={noti?.status}
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