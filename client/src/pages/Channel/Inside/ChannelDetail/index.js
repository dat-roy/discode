import React from "react"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../../../store/hooks";
import { useSocket } from "../../../../store/hooks";

import { Stack, Typography } from "@mui/material"
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { IconButton } from "@mui/material";
import SearchBar from "../../../../components/SearchBar"

export default function ChannelDetail() {
    const [members, setMembers] = useState([]);

    const params = useParams();
    const [state,] = useStore();
    const [socketState,] = useSocket();
    const socket = socketState.instance;

    const channel_id = parseInt(params.id);

    useEffect(() => {
        
    }, [])

    return (
        <Stack
            sx={{
                width: "auto",
                height: "100vh",
                maxHeight: "100vh",
                margin: "0 auto",
            }}
        >
            <Stack
                pt={3}
                direction="row"
                width="100%"
                alignItems={"center"}
                justifyContent={"center"}
            >
                <SearchBar placeholder={"Search members..."} style={{ width: "30%" }} />

                <Stack
                    direction="row"
                    spacing={-1}
                >
                    <IconButton
                        size="large" color="inherit"
                    >
                        <NotificationsIcon />
                    </IconButton>
                    <IconButton
                        size="large" color="inherit"
                    >
                        <SettingsIcon />
                    </IconButton>
                </Stack>
            </Stack>

            <Stack>
                <Typography>Admin:</Typography>
                <Stack>

                </Stack>
            </Stack>

            <Stack>
                <Typography>Online:</Typography>
                <Stack>

                </Stack>
            </Stack>

            <Stack>
                <Typography>Offline:</Typography>
                <Stack>

                </Stack>
            </Stack>
        </Stack>
    )
}