import React from "react";

import { Box } from "@mui/system";
import { Typography } from '@mui/material';

import Inbox from '../Inbox'


export default function Main() {
    return (
        <Box
            sx={{
                width: "auto",
                flexGrow: 1,
                minHeight: 100,
            }}
        >
            <Typography 
                sx={{
                    variant: "subtitle1",
                    color: "#bdbdbd",
                    textAlign: "center", 
                    paddingTop: 4, 
                }}
            >
                <Inbox/>
            </Typography>
        </Box>
    )
}