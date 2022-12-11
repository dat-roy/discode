import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../../store/hooks"
import PageNotFound from "../PageNotFound";
import { handleGetUserByUsernameAPI } from "../../services";
import { Avatar, Box, Button, Grid, Stack, Typography } from "@mui/material";
import { toast } from "react-toastify";

export default function Profile() {
    const navigate = useNavigate();
    const [state,] = useStore();
    const [userInfo, setUserInfo] = useState(null);
    const param = new URLSearchParams(useLocation().search).get("username");
    useEffect(() => {
        handleGetUserByUsernameAPI(param)
            .then(res => {
                setUserInfo(res.data?.user_data);
            })
            .catch(err => {
                return toast.error(err.message);
            })
    }, [param])

    if (!userInfo || !userInfo.username) {
        return <PageNotFound />
    }
    // if (userInfo.username === state.user.username) {
    //     return (
    //         // <>
    //         //     <h2>Hello "{state.user.username}" (This is me)</h2>
    //         //     <h4>Email: {state.user.email}</h4>
    //         //     <img src={state.user.avatar_url} alt="avt" />
    //         //     <h5><i>There's more...</i></h5>
    //         // </>
    //     )
    // } else {

    //     const handleOpenInbox = () => {
    //         navigate(`/chat/${userInfo.id}`)
    //     }

    //     return (
    //         // <>
    //         //     <h2>User: "{userInfo.username}" (Another people)</h2>
    //         //     <h4>Email: {userInfo.email}</h4>
    //         //     <img alt="avatar" src={userInfo.avatar_url} />
    //         //     <h5><i>There's more...</i></h5>
    //         //     <button>Follow</button>
    //         //     <button onClick={handleOpenInbox}>Open chat inbox</button>
    //         // </>
    //     )
    // }

    return (
        <Stack
            width={"100%"}
            height={"100vh"}
            overflow={"scroll"}
        >
            <Stack
                id={"backdrop"}
                minHeight={250}
                style={{
                    backgroundColor: "green"
                }}
            >
                <Box
                    style={{
                        height: "100%",
                        width: "74%",
                        margin: "auto",
                        backgroundImage: "url('https://media.istockphoto.com/photos/3d-abstract-background-with-ultraviolet-neon-lights-empty-frame-picture-id1191719793?b=1&k=20&m=1191719793&s=612x612&w=0&h=OMpsFvr6bZiuBkj0HnFyNNTU401COhP317Q_QSwmVpg=')",
                        backgroundSize: "cover",
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                    }}
                />
            </Stack>
            <Box position={"relative"}>
                <Avatar
                    src={userInfo.avatar_url}
                    style={{
                        position: "absolute",
                        width: 110,
                        height: 110,
                        left: 300,
                        top: -65,
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                />
            </Box>

            <Box
                style={{
                    width: "100%",
                    //minHeight: "200px",
                    backgroundColor: "green",
                }}
            >
                <Stack
                    border={"1px solid yellow"}
                    style={{
                        width: "68%",
                        margin: "auto",
                    }}
                >
                    <Stack
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"space-around"}
                        style={{
                            width: "68%",
                            margin: "auto",
                            minHeight: "100px",
                        }}
                    >
                        <Stack>
                            <Typography>100</Typography>
                            <Typography>Followers</Typography>
                        </Stack>

                        <Stack>
                            <Typography>100</Typography>
                            <Typography>Following</Typography>
                        </Stack>
                        <Stack>
                            <Typography>100</Typography>
                            <Typography>Posts</Typography>
                        </Stack>
                    </Stack>

                    <Stack direction={"row"} justifyContent={"flex-end"}>
                        <Button>Follow</Button>
                        <Button>Send Message</Button>
                        <Button>More</Button>
                    </Stack>
                </Stack>
            </Box>

            <Stack border={"1px solid red"} height={"100%"}>
                <Grid 
                    container
                    spacing={2}
                    width={"68%"}
                    height={"100%"}
                    margin={"auto"}
                >
                    <Grid item xs border={"1px solid orange"} p={2}>
                        <Stack border={"1px solid black"}>
                            About:
                        </Stack>
                    </Grid>
                    <Grid item xs={7.5} border={"1px solid blue"}>

                    </Grid>
                </Grid>
            </Stack>
        </Stack>
    )
} 