import React from "react";

import { Box } from "@mui/system";
import { Typography } from '@mui/material';


export default function LeftBar({children}) {
    return (
        <Box
            sx={{
                width: "25%", 
                bgcolor: "rgba(19, 47, 76, 0.4)",
            }}
        >
            {/* <Typography 
                sx={{
                    variant: "subtitle1",
                    color: "#bdbdbd",
                    textAlign: "center", 
                    paddingTop: 4, 
                }}
            >
                All my conversations:
            </Typography> */}
            {children}
        </Box>
    )
}