import React from "react";

import { Box } from "@mui/system";

export default function Main({children}) {
    return (
        <Box
            sx={{
                width: "auto",
                flexGrow: 1,
                minHeight: 100,
            }}
        >
            {children}
        </Box>
    )
}