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
            {children}
        </Box>
    )
}