import React from "react";
import { Avatar, Button, Grid, IconButton, Stack, Typography } from "@mui/material"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
export default function Notification() {
    return (
        <Stack
            height={"100vh"}
            borderLeft={"1px dotted gray"}
            padding={16}
            paddingTop={4}
            paddingBottom={4}
            style={{
                overflowY: "scroll",
            }}
        >
            <Typography variant="h5" fontWeight={600}>Notifications</Typography>
            <Grid container spacing={2} justifyContent="center"
                sx={{
                    height: "100vh",
                    marginTop: 3,
                    paddingBottom: 8,
                }}
            >
                <Grid item xs={8}>
                    <Stack
                        style={{
                            height: "100%",
                            backgroundColor: "#11273c",
                            borderRadius: 10,
                        }}
                    >
                        <Typography variant={"h6"}>General</Typography>
                        <Button>Mark all as read</Button>
                        <Stack p={2} pt={0} pb={0}>
                            {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5,].map((obj, index) => {
                                return <GeneralNotiElem key={index} />
                            })}
                        </Stack>
                    </Stack>
                </Grid>

                <Grid item xs>
                    <Stack
                        style={{
                            height: "100%",
                            backgroundColor: "#11273c",
                            borderRadius: 10,
                        }}
                    >
                        <Typography variant={"h6"}>Channel</Typography>
                        <Button>Mark all as read</Button>
                        <Stack p={2} pt={0} pb={0}>
                            {[1, 2, 3, 4].map((obj, index) => {
                                return <ChannelNotiElem key={index} />
                            })}
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    )
}

function GeneralNotiElem() {
    return (
        <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-around"}
            spacing={3}
            style={{
                height: 72,
            }}
            p={1.5} pt={0} pb={0}
            sx={{
                '&:hover': {
                    borderRadius: 2,
                    backgroundColor: "rgba(222, 221, 221, 0.3)",
                    cursor: "pointer",
                }
            }}
        >
            <Avatar
                src={""}
                style={{
                    width: 55,
                    height: 55,
                }}
            />
            <Stack
                flexGrow={1}
            >
                <Typography variant={"body1"}>Notification content</Typography>
                <Typography variant={"caption"}>2 minutes ago</Typography>
            </Stack>
            <Stack>
                <IconButton>
                    <MoreHorizIcon style={{ color: "gray", fontSize: 30, }} />
                </IconButton>
            </Stack>
        </Stack>
    )
}

function ChannelNotiElem() {
    return (
        <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            spacing={3}
        >
            <Avatar
                src={""}
                style={{
                    width: 55,
                    height: 55,
                }}
            />
            <Stack>
                <Typography variant={"body2"}>@ABC invited you to join 'DEF' channel...</Typography>
                <Typography variant={"caption"}>10 hours ago</Typography>
                <Stack direction={"row"}>
                    <Button>Accept</Button>
                    <Button>Decline</Button>
                </Stack>
            </Stack>

            <Stack>
                <IconButton>
                    <MoreHorizIcon style={{ color: "gray", fontSize: 30, }} />
                </IconButton>
            </Stack>
        </Stack>
    )
}