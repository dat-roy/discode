import React from "react";
import { Stack, Typography } from "@mui/material";

export default function Home() {
    return (
        <Stack
            alignItems={"center"}
            justifyContent={"center"}
            style={{
                width: "100%",
                height: "100vh",
                borderLeft: "1px solid #3E4042",
            }}
        >
            <Typography variant="h6" style={{color: "gray"}}>
                This is a dashboard. Comming soon!
            </Typography>
        </Stack>
    )
} 