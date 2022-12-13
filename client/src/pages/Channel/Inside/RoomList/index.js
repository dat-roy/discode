import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import { styled } from "@mui/material/styles";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useStore } from "../../../../store/hooks";
import { handleGetChannelByIdAPI, handleGetGroupRoomsAPI, handleCreateNewChannelRoomAPI } from "../../../../services";

import MuiList from '@mui/material/List';
import MuiListItem from '@mui/material/ListItem';
import MuiListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { Avatar, Box, Button, CircularProgress, TextField } from "@mui/material";
import { Stack, Typography } from "@mui/material";
import { Divider } from "@mui/material";
import { Modal } from "antd";
import { toast } from 'react-toastify';
import "../../../../styles/modal.css";

const List = styled(MuiList)({
    "& .MuiListItemButton-root": {
        paddingLeft: 24,
        paddingRight: 24,
    },
    "& .MuiListItemIcon-root": {
        minWidth: 0,
        marginRight: 18,
    },
});

const ListItem = styled(MuiListItem)({})

const ListItemButton = styled(MuiListItemButton)({
    "&:hover": {
        //bgcolor: "",
    },
    "&.Mui-selected": {
        //backgroundColor: "#01579b",
    },
    "&.Mui-selected:hover": {
        //backgroundColor: "#1565c0",
    },
})

const RoomElement = ({ channel_id, room, selected }) => {
    //console.log(room);
    const navigate = useNavigate();
    return <ListItem
        disablePadding
        disableGutters
    >
        <ListItemButton
            onClick={() => {
                navigate(`/channels/${channel_id}/${room.room_id}`)
            }}
            selected={selected === parseInt(room.room_id)}
        >
            <ListItemIcon
                sx={{
                    fontSize: 20,
                    color: "white",
                }}
            >
                🚩
            </ListItemIcon>
            <ListItemText
                primary={room.title}
                primaryTypographyProps={{
                    style: {
                        fontWeight: 'medium',
                        letterSpacing: 1,
                    }
                }}
            />
        </ListItemButton>
    </ListItem>
}

export default function RoomList() {
    const [state,] = useStore();
    const params = useParams();
    const channel_id = parseInt(params.id);

    const [channel, setChannel] = useState([])
    const [rooms, setRooms] = useState([]);
    const [joined, setJoined] = useState(false);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState(parseInt(params.room_id));

    useEffect(() => {
        setSelected(parseInt(params.room_id))
    }, [params.room_id])

    useEffect(() => {
        handleGetChannelByIdAPI(state.user.id, channel_id)
            .then(res => {
                setChannel(res.data?.channel)
                setJoined(res.data?.joined)
            })
            .catch(err => {
                return toast.error(err.message);
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 300);
            })
    }, [state?.user?.id, params.id, channel_id])

    useEffect(() => {
        if (joined) {
            handleGetGroupRoomsAPI(state.user.id, channel_id)
                .then(res => {
                    if (res.status !== 200) {
                        throw new Error("Failed to connect to server");
                    }
                    setRooms(res.data?.rooms);
                })
                .catch(err => {
                    return toast.error(err.message);
                })
        } else {
            //Channel preview.
        }
    }, [state?.user?.id, channel_id, joined])

    if (!joined) {
        return <></>
    }
    if (!loading && !channel?.id) {
        return <></>
    }
    if (loading) {
        return <Stack alignItems={"center"} pt={3}>
            <CircularProgress size={30}/>
        </Stack>
    }
    return (
        <Box style={{ height: "100%" }}>
            <Stack height={"35vh"}>
                <Stack
                    p={0}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Card
                        sx={{
                            width: "100%",
                            borderRadius: 0,
                            bgcolor: "inherit",
                            boxShadow: "none",
                        }}
                    >
                        <CardMedia
                            component="img"
                            height="140"
                            image={channel?.background_url}
                            alt="backdrop"
                        />
                        <Box
                            key={"wrapper"}
                            alignItems="center"
                            position={"relative"}
                        >
                            <Avatar
                                src={channel?.avatar_url}
                                key={"Channel-logo"}
                                style={{
                                    position: "absolute",
                                    width: 70,
                                    height: 70,
                                    left: 0,
                                    right: 0,
                                    top: -35,
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            />
                        </Box>
                        <CardContent
                            width="100%"
                            sx={{
                                bgcolor: "inherit",
                                color: "orange",
                                padding: 2,
                            }}
                        >
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    textAlign: "center",
                                    paddingTop: 4,
                                }}
                            >
                                {channel?.title}
                            </Typography>
                        </CardContent>
                    </Card>
                </Stack>

                <Box
                    paddingLeft={2}
                    paddingRight={2}
                    paddingBottom={1}
                >
                    <Divider
                        variant="middle" flexItem
                        color={"gray"}
                    />
                </Box>
            </Stack>

            <Stack>
                {
                    (channel?.admin_id === state.user.id)
                        ? <Stack
                            top={0}
                            position={"sticky"}
                            alignItems={"center"}
                        >
                            <RoomCreator />
                        </Stack>
                        : null
                }
                <List
                    style={{
                        height: "48vh",
                        overflowY: "scroll",
                        paddingLeft: 20,
                        paddingRight: 20,
                    }}
                >
                    {
                        rooms.map((room, index) => {
                            return <RoomElement
                                key={index}
                                room={room}
                                channel_id={channel_id}
                                selected={selected}
                            />
                        })
                    }
                </List>
            </Stack>
            {/* <Stack
                style={{
                    border: "1px solid red",
                    height: "100%",
                }}
            >
                <Avatar src={state.user.avatar_url} />
            </Stack> */}
        </Box >
    )

    function RoomCreator() {
        const roomNameRef = useRef();
        const [openModal, setOpenModal] = useState(false);
        const [confirmLoading, setConfirmLoading] = useState(false);

        const handleOk = () => {
            if (!roomNameRef.current?.value) {
                return toast.error("Room name can not be empty")
            }
            if (roomNameRef.current?.value[0] === ' ') {
                return toast.error("Room name can not be started by spaces");
            }
            setConfirmLoading(true);
            handleCreateNewChannelRoomAPI(
                channel_id,
                state.user.id,
                (roomNameRef.current.value).trim()
            )
                .then(res => {
                    if (res.data?.exist) {
                        return toast.error("Duplicate name error!")
                    }
                    toast.success("Create new room successfully!")
                    setRooms(old => [...old, res.data?.new_room])
                    setTimeout(() => {
                        setOpenModal(false);
                    }, 1000)
                })
                .catch(err => {
                    return toast.error(err.message)
                })
                .finally(() => {
                    setConfirmLoading(false);
                })
        }

        const handleCancel = () => {
            setOpenModal(false);
        }

        return (<>
            <Button onClick={() => setOpenModal(true)}>Create new room</Button>
            <Modal
                centered
                open={openModal}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={"Create room"}
                confirmLoading={confirmLoading}
                className={"createRoomModal"}
            >
                <Stack spacing={2} justifyContent={"space-around"}>
                    <Typography variant={"h5"} color={"#00b4ef"}>Create a new room</Typography>
                    <TextField
                        inputRef={roomNameRef}
                        variant="filled"
                        label="Enter room name"
                        style={{
                            width: "100%",
                            paddingBottom: 20,
                        }}
                        inputProps={{
                            style: {
                                color: "white",
                            }
                        }}
                    />
                </Stack>
            </Modal>
        </>)
    }
}