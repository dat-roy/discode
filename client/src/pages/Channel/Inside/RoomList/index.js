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
import { toast } from 'react-toastify';

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
                console.log(res.data?.channel)
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
        } else {
            //Channel preview.
        }
    }, [state?.user?.id, channel_id, joined])

    if (!joined) {
        return <></>
    }

    return (
        <Box>
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