import React, { useEffect, useState } from "react"
import { Modal } from "antd";
import { Stack, Button, Typography, Avatar } from "@mui/material";
import { handleGetUserByIdAPI } from "../../services";
import { useStore } from "../../store/hooks"
import { toast } from "react-toastify";
import "./modal.css";

export default function ChannelModal(props) {
    const {
        openModal,
        handleClose,
        onOk, onCancel,
        okText, cancelText,
        channel,
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
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <Avatar src={admin?.avatar_url} style={{ width: 30, height: 30, }} />
                    <Typography variant="subtitle2" style={{ fontSize: 16, color: "greenyellow" }}>
                        Admin: @{admin?.username}
                    </Typography>
                </Stack>
                <Typography>Created at: {channel?.created_at}</Typography>
                <Typography>{channel?.members} Members</Typography>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}
                    spacing={2}
                >
                    <Button
                        onClick={onOk}
                        variant={"contained"}
                        color={"success"}
                        disabled={(state.user.id === admin?.id) ? true : false}
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
            </Modal>
        </>
    )
}