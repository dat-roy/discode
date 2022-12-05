import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useStore } from "../../../../store/hooks";
import { handleGetJoinedChannelsAPI } from "../../../../services";

import { styled } from "@mui/material/styles";
import MuiList from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

import { Box } from "@mui/material";
import { Stack, Typography } from "@mui/material";
import { Divider } from "@mui/material";
import SearchBar from "../../../../components/SearchBar";

import { toast } from 'react-toastify';
import ChannelCreator from "../ChannelCreator";

const List = styled(MuiList)({
    "& .MuiListItemButton-root": {
        paddingLeft: 24,
        paddingRight: 24
    },
    "& .MuiListItemIcon-root": {
        minWidth: 0,
        marginRight: 16
    },
});

export default function ChannelList() {
    const [state,] = useStore();
    const navigate = useNavigate();
    const [myChannels, setMyChannels] = useState([]);
    const [otherChannels, setOtherChannels] = useState([]);

    useEffect(() => {
        handleGetJoinedChannelsAPI(state.user.id)
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error("Failed to connect to server");
                }
                const channels = res.data?.joined_channels;
                const mine = channels.filter(channel => channel.admin_id === state.user.id)
                const others = channels.filter(channel => channel.admin_id !== state.user.id)
                setMyChannels(mine);
                setOtherChannels(others);
            })
            .catch(err => {
                return toast.error(err.message);
            })
    }, [state.user.id])

    const renderChannelList = (channels, title, icon) => {
        return <Fragment>
            <ListSubheader
                key={title}
                sx={{
                    bgcolor: "#1a237e",
                    color: "white",
                    fontSize: 18,
                    fontWeight: 'medium',
                    letterSpacing: 0.2,
                }}
            >
                <ListItemIcon sx={{ fontSize: 20, color: "white" }}>{icon}</ListItemIcon>
                {title}
            </ListSubheader>
            {
                (channels.length === 0)
                    ? <Box
                        sx={{
                            height: "auto",
                            textAlign: "center",
                            padding: 3,
                        }}
                    >
                        <Typography fontStyle="italic">No channels found</Typography>
                    </Box>
                    : channels.map((channel, index) => (
                        <Fragment key={index}>
                            <ListItem
                                key={index}
                                disablePadding
                            >
                                <ListItemButton
                                    component="a"
                                    onClick={() => {
                                        navigate(`/channels/${channel?.id}`)
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{ fontSize: 20, color: "white", pl: 2 }}
                                    >🔥</ListItemIcon>
                                    <ListItemText primary={channel?.title} />
                                </ListItemButton>

                            </ListItem>
                            <Box
                                paddingLeft={0}
                                paddingRight={0}
                                key={index + "divider"}
                            >
                                <Divider variant="middle" color={"gray"} />
                            </Box>
                        </Fragment>
                    ))
            }
        </Fragment>
    }

    return (
        <Box>
            <Stack>
                <Stack
                    p={3}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 'bold',
                        }}
                    >
                        Channels
                    </Typography>
                    <ChannelCreator />
                </Stack>

                <Stack>
                    <SearchBar placeholder={"Search..."} />
                </Stack>

                <Box
                    marginTop={3}
                    padding={1}
                >
                    <Divider
                        variant="middle"
                        color={"gray"}
                    />
                </Box>
            </Stack>

            <List
                sx={{
                    width: '100%',
                    position: 'relative',
                    overflow: 'auto',
                    height: "75vh",
                    '& ul': { padding: 2.8 },
                }}
                subheader={<li />}
            >
                <li key={`section-1`}>
                    <ul>
                        {renderChannelList(myChannels, "Your channels: ", '⭐')}
                    </ul>
                </li>
                <li key={`section-2`}>
                    <ul>
                        {renderChannelList(otherChannels, "Joined channels: ", '⭐')}
                    </ul>
                </li>
            </List>
        </Box>
    )
}