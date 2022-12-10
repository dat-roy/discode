import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import { Button, IconButton, Stack, Typography, Avatar, CircularProgress } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { toast } from "react-toastify";
import "./modal.css";
import { useStore } from "../../../../../store/hooks";
import { handleAddMemberAPI, handleGetChannelRequestsAPI, handleMarkOneNotiAsReadAPI } from "../../../../../services";
import moment from "moment";

export default function ChannelNoti(props) {
    const {
        channel_id, admin_id,
    } = props;
    const [openModal, setOpenModal] = useState(false);
    const [state,] = useStore();
    const [notis, setNotis] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (admin_id !== state.user.id) return;
        if (!openModal) return;
        handleGetChannelRequestsAPI(admin_id, channel_id)
            .then(res => {
                console.log(res);
                setNotis(res.data?.notis)
            })
            .catch(err => {
                return toast.error(err.message);
            })
            .finally(() => {
                //setLoading(false);
            })
    }, [openModal])

    const handleCancel = () => {
        setOpenModal(false);
    }

    if (admin_id !== state.user.id) {
        <IconButton
            size="large" color="inherit"
            onClick={() => setOpenModal(true)}
            disabled
        >
            <NotificationsIcon />
        </IconButton>
    }

    return (
        <>
            <IconButton
                size="large" color="inherit"
                onClick={() => setOpenModal(true)}
            >
                <NotificationsIcon />
            </IconButton>
            <Modal
                open={openModal}
                centered
                onCancel={handleCancel}
                footer={null}
                bodyStyle={{
                    color: "lightgray",
                    minHeight: "500px",
                    height: "600px",
                }}
            >
                <Typography pt={1} variant="h5" style={{ fontWeight: 500, color: "#62d58a" }}>Joining Requests:</Typography>
                {(loading)
                    ? <Stack alignItems={"center"}><CircularProgress /></Stack>
                    : (notis?.length === 0)
                        ? <Stack alignItems={"center"} pt={5}>
                            <Typography style={{ color: "gray" }}>--- You doesn't have any notifications here ---</Typography>
                        </Stack>
                        : <Stack mt={3} style={{height: "87%", overflowY: "scroll"}}>
                            {notis.map((noti, index) => {
                                return <ChannelNotiElem
                                    key={index}
                                    noti={noti}
                                    channel_id={channel_id}
                                />
                            })}
                        </Stack>
                }
            </Modal>
        </>
    )
}

function ChannelNotiElem({ noti, channel_id }) {
    const [state,] = useStore()
    const sender = noti?.sender;
    const [read, setRead] = useState(noti?.status === 0 ? false : true);

    const markRead = () => {
        handleMarkOneNotiAsReadAPI(state.user.id, noti.notification_id)
            .then(() => setRead(true))
    }

    const handleAccept = () => {
        handleAddMemberAPI(sender.id, channel_id)
            .then((res) => {
                if (res.data?.exist) {
                    throw new Error("Member already in channel!")
                }
                markRead()
            })
            .catch(err => {
                return toast.error(err.message)
            })
    }

    const handleDecline = () => {
        markRead()
    }

    return (
        <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-around"}
            spacing={3}
            p={1.6}
            mb={2}
            sx={{
                borderRadius: 2,
                minHeight: 72,
                color: (read) ? "#B0B3B8" : "inherit",
                backgroundColor: (read) ? "rgb(91 177 214 / 4%)" : "rgb(91 177 214 / 10%)",
            }}
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
                    <span
                        style={{
                            color: "yellow"
                        }}
                    >
                        @{sender?.username}
                    </span> requested to join your channel.
                </Typography>
                <Typography variant={"caption"}>
                    {moment(noti?.created_at).fromNow()}
                </Typography>

                <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
                    <Button variant="contained"
                        style={{ borderRadius: 7, height: 32, }}
                        color={"success"} disabled={read}
                        onClick={handleAccept}
                    >Accept</Button>
                    <Button variant="contained"
                        style={{ borderRadius: 7, height: 32, }}
                        color={"error"} disabled={read}
                        onClick={handleDecline}
                    >Decline</Button>
                </Stack>
            </Stack>

        </Stack>
    )
}