import { Link } from "react-router-dom";
import { Box, Button, Avatar, Stack, Typography } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CreateIcon from '@mui/icons-material/Create';

const getRankImg = (rank) => {
    switch (rank) {
        case 1: return 'https://raw.githubusercontent.com/dat-roy/a4k29-contest/main/assets/img/1st.png'
        case 2: return 'https://raw.githubusercontent.com/dat-roy/a4k29-contest/main/assets/img/2nd.png'
        case 3: return 'https://raw.githubusercontent.com/dat-roy/a4k29-contest/main/assets/img/3rd.png'
    }
}

const getBorderColor = (rank) => {
    switch (rank) {
        case 1: return 'rgba(255,223,0,0.3)'
        case 2: return 'rgba(192,192,192,0.3)'
        case 3: return 'rgba(205,127,50,0.3)'
    }
}

const getTextColor = (rank) => {
    switch (rank) {
        case 1: return 'gold'
        case 2: return 'silver'
        case 3: return '#cd7f32'
    }
}

export default function AuthorItem({ author, rank }) {
    console.log(author);
    return (
        <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            spacing={1.3}
            mt={1.8}
            sx={{
                bgcolor: "#1c2b40",
                p: 2,
                pt: 1, pb: 1,
                borderRadius: 5,
            }}
        >
            <Box component={'img'}
                src={getRankImg(rank)}
                width={"42px"}
                mt={0.4}
            />
            <Stack
                flexGrow={1}
                alignItems={"center"}
                justifyContent={"flex-start"}
                direction={"row"}
                spacing={1}
                pl={1}
            >
                <Link to={`/profile?username=${author?.username}`}>
                    <Avatar src={author?.avatar_url}
                        sx={{
                            width: "2rem",
                            height: "2rem",
                            border: `4px solid ${getBorderColor(rank)}`,
                        }}
                    />
                </Link>
                <Stack spacing={0.4} flexGrow={2}>
                    <Typography variant={"h6"} style={{ fontSize: "16px", color: getTextColor(rank) }}>@{author?.username}</Typography>
                    <Typography
                        variant={"caption"}
                        align={'left'}
                        style={{
                            color: "lightgray",
                            wordWrap: "break-word",
                            whiteSpace: 'pre-line',
                            overflow: "hidden",
                            width: "100px",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                        }}
                        title={author?.description ? author?.description : '_'}
                    >
                        {/* {author?.description
                            ? author?.description
                            : <span style={{ color: "transparent" }}>_</span>} */}
                        {author?.description}
                    </Typography>
                </Stack>
                <Stack spacing={1} mt={1}>
                    <Stack direction={"row"} spacing={0.3} alignItems={"center"}>
                        <FavoriteBorderIcon style={{ color: "pink", fontSize: 18 }} />
                        <Typography variant="caption">{author?.sum_likes}</Typography>
                    </Stack>
                    <Stack direction={"row"} spacing={0.3} alignItems={"center"}>
                        <CreateIcon style={{ color: "lightgreen", fontSize: 18 }} />
                        <Typography variant="caption">{author?.sum_posts}</Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}