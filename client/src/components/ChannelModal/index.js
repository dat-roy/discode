import React from "react"
import { Modal } from "antd";
import { Stack, Button, Typography } from "@mui/material";

export default function ChannelModal(props) {
    const {
        openModal,
        handleClose,
        onOk, onCancel,
        okText, cancelText,
    } = props;

    return (
        <>
            <Modal
                title={
                    <>
                        <Typography>
                            Channel name?
                        </Typography>
                    </>
                }
                centered
                open={openModal}
                onCancel={handleClose}
                width={"40%"}
                height={"40%"}
                footer={null}
            >
                <Typography>Description:</Typography>
                <Typography>Created at: 10/10/2002</Typography>
                <Typography>Members: 120.992</Typography>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
                    <Button onClick={onOk}>
                        {okText}
                    </Button>
                    <Button onClick={onCancel}>
                        {cancelText}
                    </Button>
                </Stack>
            </Modal>
        </>
    )
}