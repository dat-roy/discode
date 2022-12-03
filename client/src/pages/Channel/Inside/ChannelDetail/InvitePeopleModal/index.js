import React from "react"
import { useState, useRef } from "react";
import { useStore } from "../../../../../store/hooks";
import { Box, Button, Stack } from "@mui/material";
import { Typography, TextField } from "@mui/material"
import { Modal, Spin } from "antd";
import { List, ListItem } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import {
    handleInvitePeopleAPI,
    handleSearchUserNotInChannelByTextAPI,
} from "../../../../../services";
import "../../../../../styles/modal.css"
import { toast } from "react-toastify"

export default function InvitePeopleModal(props) {
    const [state,] = useStore();
    const {
        channel_id,
    } = props;
    const usernameRef = useRef();
    const [openModal, setOpenModal] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [userList, setUserList] = useState([]);

    const handleCancel = () => {
        setOpenModal(false);
        setUserList([]);
    }

    const handleChangeInput = () => {
        if (usernameRef.current.value) {
            setSearchLoading(true);
            setTimeout(() => {
                handleSearchUserNotInChannelByTextAPI(
                    state.user.id,
                    channel_id,
                    usernameRef.current.value,
                )
                    .then(res => {
                        setUserList(res.data?.results)
                    })
                    .catch(err => {
                        return toast.error(err.message);
                    })
                    .finally(() => {
                        setSearchLoading(false);
                    })
            }, 300)
        }
    }

    return (
        <>
            <Button onClick={() => setOpenModal(true)}>Invite People</Button>
            <Modal
                title={
                    <>
                        <Typography variant={"h5"} color={"white"}>
                            Invite people to our channel
                        </Typography>
                        <Typography variant={"body2"} color={"gray"}>
                            The more the merrier, right? 😗
                        </Typography>
                    </>
                }
                centered
                open={openModal}
                onCancel={handleCancel}
                footer={null}
                className={"createRoomModal"}
            >
                <Typography variant="subtitle1">
                    Username
                </Typography>
                <TextField
                    inputRef={usernameRef}
                    variant="filled"
                    placeholder="Search for username or email"
                    onChange={handleChangeInput}
                    inputProps={{
                        style: {
                            color: "white",
                        }
                    }}
                    style={{
                        width: "100%",
                    }}
                />
                <Box
                    minHeight={"40vh"}
                    maxHeight={"40vh"}
                    style={{
                        overflowY: "scroll",
                    }}
                >
                    {
                        (searchLoading)
                            ? <Stack paddingTop={2}>
                                <Spin tip="Loading" />
                            </Stack>
                            : <List>
                                {
                                    userList?.map((user, index) => {
                                        return (
                                            <ListItem
                                                key={index}
                                                disableGutters
                                                secondaryAction={
                                                    <InviteButton
                                                        user={user}
                                                        setUserList={setUserList}
                                                        channel_id={channel_id}
                                                    />
                                                }
                                                style={{
                                                    border: "1px solid red",
                                                }}
                                            >
                                                {user.username} - {user.email}

                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                    }
                </Box>
            </Modal>
        </>
    )
}

function InviteButton(props) {
    const [state,] = useStore();
    const {
        user,
        setUserList,
        channel_id,
    } = props;
    const [loading, setLoading] = useState(false);

    const handleInvite = () => {
        if (user.invited) return;
        setLoading(true);
        setTimeout(() => {
            handleInvitePeopleAPI(
                state.user.id, user.id, channel_id,
            )
                .then(res => {
                    if (res.status === 200) {
                        setUserList(old => old.map(elem => {
                            if (elem.id === user.id) {
                                elem.invited = 1;
                            }
                            return elem;
                        }))
                    }
                })
                .catch(err => {
                    toast.error(err.message);
                })
                .finally(() => {
                    setLoading(old => !old);
                })
        }, 1000)
    }
    if (user.invited) {
        return (
            <Button
                disabled
                style={{
                    color: "#0277bd"
                }}
            >
                Pending
            </Button>
        )
    }

    return (
        <LoadingButton
            loading={loading}
            onClick={handleInvite}
            variant="contained"
            startIcon={<AddIcon />}
            loadingPosition="start"
            sx={{
                "&.Mui-disabled": {
                    color: "#bbdefb", 
                    backgroundColor: "#1565c0",
                }, 
            }}
            //disabled
        >
            Invite
        </LoadingButton>
    )
}