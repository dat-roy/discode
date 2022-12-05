import React from "react";
import { Box, Stack, Typography } from "@mui/material"

export default function ChannelHome() {
    return (
        <Stack
            alignItems={"center"}
            justifyContent={"center"}
            sx={{
                width: "100%", 
                height: "100vh",
            }}
        >
            <Typography variant={"h5"} fontFamily={"cursive"}>Welcome!</Typography>
        </Stack>
    )
}