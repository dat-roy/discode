import React from "react";
import { Box } from "@mui/system";

export default function RightBar({children}) {
    return (
        <Box
            sx={{
                minWidth: "22%", 
                maxWidth: "22%",
                bgcolor: "rgba(19, 47, 76, 0.4)",
            }}
        >
            {children}
        </Box>
    )
}