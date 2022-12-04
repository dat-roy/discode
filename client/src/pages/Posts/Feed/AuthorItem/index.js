import { Box, Button, Avatar, Stack, Typography } from "@mui/material";

export default function AuthorItem() {
    return (
        <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            spacing={1.2}
        >
            <Box style={{
                border: "1px solid red",
            }}>
                <Avatar src="" sx={{ width: "3rem", height: "3rem" }} />
            </Box>
            <Stack
                flexGrow={1}
                style={{
                    border: "1px solid red",
                }}
            >
                <Typography variant={"h6"} style={{ fontSize: "18px" }}>Username</Typography>
                <Typography
                    variant={"caption"}
                    align={'left'}
                    style={{
                        wordWrap: "break-word",
                        whiteSpace: 'pre-line',
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                    }}
                >Description long long long long long long long long lllllllllllllllllllllllll
                llllllllllllllllllllllllllllllll</Typography>
            </Stack>
            <Box
                style={{
                    border: "1px solid red",
                }}
            >
                <Button>
                    Follow
                </Button>
            </Box>
        </Stack>
    )
}