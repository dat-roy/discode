import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography, Button } from "@mui/material"
import Typed from "typed.js"
import { useStore } from "../../store/hooks";
import "./index.css";

export default function Landing() {
    const [state,] = useStore();
    const navigate = useNavigate();

    // Create reference to store the DOM element containing the animation 
    const el = useRef(null);
    // Create reference to store the Typed instance itself
    const typed = useRef(null);

    useEffect(() => {
        const options = {
            strings: [
                //'<span style="color: lightblue; font-weight: 600;">Discode</span>',
                '<span class="mainTitle">Discode</span>',
            ],
            typeSpeed: 100,
            backSpeed: 60,
            loop: true,
        };

        // elRef refers to the <span> rendered below
        typed.current = new Typed(el.current, options);

        return () => {
            // Make sure to destroy Typed instance during cleanup
            // to prevent memory leaks
            typed.current.destroy();
        }
    }, [])

    return (
        <Stack
            alignItems={"center"}
            justifyContent={"center"}
            width={"100%"}
            height={"100vh"}
            overflow={"hidden"}
        >

            <Stack alignItems={"center"} justifyContent={"space-between"} spacing={4}>
                <Typography
                    variant="h4"
                    style={{
                        textTransform: "uppercase",
                        color: "gray",
                    }}
                >
                    Welcome to <span style={{ whiteSpace: 'pre' }} ref={el} />
                </Typography>
                <Box>
                    {(state?.isLogged)
                        ? <Stack alignItems={"center"} justifyContent={"center"} spacing={1}>
                            <Typography variant="subtitle1" style={{color: "lightblue"}}>You are already logged in</Typography>
                            <Button variant={"outlined"} onClick={() => navigate('/home')}>Just click here</Button>
                        </Stack>
                        : <>
                            <Button variant="outlined"
                                style={{
                                    color: "#66bfff", 
                                    width: 160,
                                    borderRadius: 10,
                                    borderWidth: "2px"
                                }}
                                onClick={() => {
                                    setTimeout(() => {
                                        navigate('/login')
                                    }, 300)
                                }}
                            >Start now</Button>
                        </>
                    }
                </Box>
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