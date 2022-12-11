import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import { Avatar, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { Modal } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleGetUserByIdAPI } from "../../services";
import { useStore } from "../../store/hooks";

import "../../styles/modal.css";

export default function ChannelModal(props) {
    const {
        openModal,
        handleClose,
        onOk, onCancel,
        okText, cancelText,
        channel,
        buttonLoading,
    } = props;
    const [state,] = useStore();
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        handleGetUserByIdAPI(channel?.admin_id)
            .then(res => {
                setAdmin(res.data?.user_data);
            })
            .catch(err => {
                return toast.error(err.message);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [channel])

    return (
        <>
            <Modal
                centered
                open={openModal}
                onCancel={handleClose}
                width={"40%"}
                height={"40%"}
                footer={null}
                bodyStyle={{
                    color: "lightgray"
                }}
            >
                {(loading)
                    ? <CircularProgress />
                    : <>
                        <Stack
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            spacing={1}
                        >
                            <Avatar
                                src={channel?.avatar_url}
                                style={{
                                    borderRadius: 10,
                                    width: 60, height: 60,
                                }}
                            />
                            <Typography variant="h6" style={{ color: "lightblue" }}>
                                Welcome to <span style={{ color: "orange" }}>{channel?.title}</span>
                            </Typography>
                            <Typography>
                                {channel?.description}
                            </Typography>
                        </Stack>
                        <Stack direction={"row"} alignItems={"center"} spacing={1} pt={5}>
                            <Typography variant="subtitle2" style={{ fontSize: 16, color: "lightgray", }}>Admin:</Typography>
                            <Avatar src={admin?.avatar_url} style={{ width: 24, height: 24, }} />
                            <Typography variant="subtitle2" style={{ fontSize: 16, color: "greenyellow" }}>
                                @{admin?.username}
                            </Typography>
                        </Stack>
                        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                            <Stack direction={"row"}
                                alignItems={"center"}
                                justifyContent={"flex-start"}
                                spacing={0.7}
                                color={"lightblue"}
                            >
                                <AccessTimeIcon style={{ fontSize: 16 }} />
                                <Typography variant="caption">
                                    Created at: {moment(channel?.created_at).format('DD/MM/YYYY')}
                                </Typography>
                            </Stack>
                            <Stack direction={"row"}
                                alignItems={"center"}
                                justifyContent={"flex-end"}
                                spacing={0.7}
                                color={"lightgreen"}
                            >
                                <PeopleIcon style={{ fontSize: 16 }} />
                                <Typography variant={"caption"}>{channel?.members} Members</Typography>
                            </Stack>
                        </Stack>

                        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}
                            spacing={2} pt={3}
                        >
                            <Button
                                onClick={onOk}
                                variant={"contained"}
                                color={"success"}
                                disabled={(state.user.id === admin?.id) ? true : (buttonLoading ? true : false)}
                            >
                                {okText}
                            </Button>
                            <Button
                                onClick={onCancel}
                                variant={"contained"}
                                color={"error"}
                            >
                                {cancelText}
                            </Button>
                        </Stack>
                    </>}
            </Modal>
        </>
    )
}