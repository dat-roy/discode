import React from "react";
import { Box } from "@mui/system";

export default function LeftBar({children}) {
    return (
        <Box
            sx={{
                width: "23%", 
                bgcolor: "rgba(19, 47, 76, 0.4)",
            }}
        >
            {children}
        </Box>
    )
}