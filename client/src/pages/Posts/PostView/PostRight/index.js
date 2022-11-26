import { Box, Typography } from "@mui/material";

export default function PostRight(props) {
    const { postData } = props;
    return (
        <Box
            padding={5}
        >
            <Typography>
                More from <b>{postData.username}</b>:
            </Typography>
            <Typography>
                Related topics:
            </Typography>
        </Box>
    )
}