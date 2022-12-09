import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSocket, useStore } from "../../store/hooks";
import { userActions } from "../../store/actions/userActions";
import { SocketActionTypes } from "../../store/actions/constants";
import { Box, Stack, Typography } from "@mui/material";
//import jwt_decode from "jwt-decode";

export default function Login() {
    const navigate = useNavigate();
    const [state, dispatch] = useStore();
    const [socketState, socketDispatch] = useSocket();
    useEffect(() => {
        const google = window.google;
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: async (oauth_response) => {
                const [
                    status_code,
                    existingAccount,
                    email,
                    action,
                ] = await userActions.userGoogleLogin({
                    credential: oauth_response.credential,
                })();

                //console.log(jwt_decode(oauth_response.credential));

                if (status_code === 200) {
                    if (existingAccount) {
                        socketDispatch({ type: SocketActionTypes.DiSCONNECT });
                        socketDispatch({ type: SocketActionTypes.CONNECT });
                        dispatch(action);
                        navigate("/home");
                    } else {
                        //New account, require completing a registration form:
                        navigate("/register", {
                            state: {
                                email: email,
                                credential: oauth_response.credential,
                            }
                        });
                    }
                }
            },
        });

        google.accounts.id.renderButton(
            document.getElementById("sign-in"),
            {
                size: "medium",
                type: "icon",
            }
        );
    }, [state.user, dispatch, navigate, socketState, socketDispatch]);

    return (
        <Stack
            alignItems={"center"}
            justifyContent={"center"}
            width={"100%"}
            height={"100vh"}
            overflow={"hidden"}
        >
            <Stack id={"main"}
                alignItems={"center"}
                justifyContent={"center"}
                spacing={3.5}
            >
                {(state.isLogged)
                    ? <>
                        <Typography variant="h5" style={{color: "lightblue"}}>You're already logged in.</Typography>
                        <Typography variant="subtitle2" style={{color: "lightgray"}}>Just go to <Link to='/home'
                            style={{
                                textDecoration: "none",
                            }}
                        >Home page</Link></Typography>
                    </>
                    : <>
                        <Typography
                            variant="h6"
                            style={{
                                textTransform: "uppercase",
                                color: "lightblue",
                            }}
                        >   Login to Discode
                        </Typography>
                        <Stack direction={"row"} alignItems={"center"} spacing={1}>
                            <Box id="sign-in"></Box>
                            <Typography>Continue with Google</Typography>
                        </Stack>
                    </>}
            </Stack>
            <Stack id={"footer"}
                style={{
                    position: "fixed",
                    bottom: 10,
                    color: "gray",
                }}
                className={"landingFooter"}
            >
                <Typography>Made with ❤️ by <Box
                    component={'a'}
                    href=""
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                    sx={{
                        textDecoration: "none",
                        "&:visited": {
                            color: "#7dffff",
                        },
                        "&:active": {
                            color: "#7dffff",
                        },
                        "&:hover": {
                            color: "#7dffff",
                        },
                    }}
                >
                    Group 1</Box>
                </Typography>
            </Stack>
        </Stack>
    )
} 