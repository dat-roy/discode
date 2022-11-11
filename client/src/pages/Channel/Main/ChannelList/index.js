import React from "react";
import { Link } from 'react-router-dom';
import { Box } from "@mui/material";
import { Stack, Typography } from "@mui/material";
import { Divider } from "@mui/material";
import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchBar from "../../../../components/SearchBar"

export default function ChannelList() {
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
                    <IconButton
                        size="large" color="inherit"
                        style={{
                            marginRight: -10,
                        }}
                        component={Link}
                        to="/channels/create"
                    >
                        <AddCircleOutlineIcon sx={{fontSize: 28}}/>
                    </IconButton>
                </Stack>

                <Stack>
                    <SearchBar placeholder={"Search..."} />
                </Stack>

                <Box
                    marginTop={3}
                    padding={1}
                >
                    <Divider
                        variant="middle" flexItem
                        color={"gray"}
                    />
                </Box>
            </Stack>

            <Stack
                direction="column"
                p={3}
                spacing={2}
                flexGrow={1}
                sx={{
                    height: "100vh",
                    overflowY: "scroll"
                }}
            >   
                <Box>
                    Your channels:
                </Box>
                <Box>
                    Joined channels:
                </Box>
            </Stack>
        </Box>
    )
}