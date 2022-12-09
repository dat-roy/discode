import React from "react"
import { Stack, Typography } from "@mui/material"
export default function NoData() {
    return (
        <Stack alignItems={"center"} marginTop={2}>
            <Typography
                variant={"subtitle1"}
                color={"rgba(200, 200, 200, 0.4)"}
            >
                <i>----- No data -----</i>
            </Typography>
        </Stack>
    )
}