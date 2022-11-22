import React, { useEffect, useState } from "react";
import { useParams, useNavigate, /*useLocation*/ } from 'react-router-dom';

import { styled } from "@mui/material/styles";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useStore } from "../../../../store/hooks";
import { handleGetChannelByIdAPI, handleGetGroupRoomsAPI } from "../../../../services/chat";

import MuiList from '@mui/material/List';
import MuiListItem from '@mui/material/ListItem';
import MuiListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { Avatar, Box } from "@mui/material";
import { Stack, Typography } from "@mui/material";
import { Divider } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    //const location = useLocation();

    const [channel, setChannel] = useState([])
    const [rooms, setRooms] = useState([]);
    const [joined, setJoined] = useState(false);

    const [selected, setSelected] = useState(parseInt(params.room_id));

    const navigate = useNavigate();

    useEffect(() => {
        if (!channel) {
            //TODO: display 404 not found
            return navigate('/home')
        }
    }, [channel, navigate])

    useEffect(() => {
        setSelected(parseInt(params.room_id))
    }, [params.room_id])

    useEffect(() => {
        handleGetChannelByIdAPI(state.user.id, channel_id)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error("Failed to connect to server");
                }
                setChannel(res.data?.channel)
                setJoined(res.data?.joined)
            })
            .catch(err => {
                return toast.error(err.message);
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
        }
    }, [state?.user?.id, channel_id, joined])

    if (!joined) {
        return <></>
    }

    return (
        <Box>
            <ToastContainer
                position="top-center"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Stack>
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
                        }}>
                        <CardMedia
                            component="img"
                            height="160"
                            image="https://kinhnghiemlaptrinh.com/wp-content/uploads/2019/09/image1-2-768x432.jpg"
                            alt="backdrop"
                        />
                        <Box
                            key={"wrapper"}
                            alignItems="center"
                            position={"relative"}
                        >
                            <Avatar
                                src={"data:image/jpeg;base64,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"}
                                sx={{
                                    position: "absolute",
                                    width: 70,
                                    height: 70,
                                    left: 0,
                                    right: 0,
                                    top: -40,
                                    ml: "auto",
                                    mr: "auto",
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
                                Fullstack-overflow
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

            <Stack pl={4} pr={4}>
                <List>
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
        </Box>
    )
}