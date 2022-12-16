import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Avatar, Card, CardHeader, Chip, Stack } from "@mui/material";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import moment from "moment";
import React from 'react';
import { useNavigate } from "react-router-dom";

const getRandInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function PostItem({ post }) {
    const author = post?.author;
    const navigate = useNavigate();
    return (
        <Card
            onClick={() => navigate(`/posts/view/${post?.id}`)}
            sx={{
                width: 300,
                borderRadius: 3,
                boxShadow: "4px 4px 11px rgba(33,33,33,.2)",
                "&:hover": {
                    cursor: "pointer",
                    boxShadow: "4px 4px 11px rgba(33,33,33,.2)",
                }
            }}
        >
            <CardMedia
                component="img"
                height="200rem"
                image={post?.background_url}
                alt="post image"
            />
            <CardHeader
                avatar={
                    <Avatar src={author?.avatar_url}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/profile?username=${author?.username}`)
                        }}
                    />
                }
                title={
                    <Typography variant="subtitle1"
                        sx={{ color: "NavajoWhite", fontWeight: 500, width: "12rem" }}
                        noWrap
                        title={post?.title}
                    >
                        {post?.title}
                    </Typography>
                }
                subheader={
                    <Stack
                        style={{
                            color: "lightgray",
                        }}
                        spacing={0.5}
                        height={"6rem"}
                    >
                        <Typography
                            variant="subtitle2"
                        >
                            By @{author?.username}
                        </Typography>
                        <Stack direction={"row"} spacing={0.6} alignItems={"center"}>
                            <AccessTimeOutlinedIcon style={{ color: "lightgray", fontSize: 14 }} />
                            <Typography variant="caption">
                                {moment(post?.created_at).format("HH:mm | YYYY-MM-DD")}
                            </Typography>
                        </Stack>

                        <Stack direction={"row"} spacing={2}>
                            <Stack direction={"row"} spacing={0.3} alignItems={"center"}>
                                <FavoriteBorderIcon style={{ color: "pink", fontSize: 18 }} />
                                <Typography variant="caption">{post?.likes}</Typography>
                            </Stack>
                            <Stack direction={"row"} spacing={0.3} alignItems={"center"}>
                                <VisibilityOutlinedIcon style={{ color: "lightblue", fontSize: 18 }} />
                                <Typography variant="caption">{getRandInt(50, 1111).toLocaleString('en-US')}</Typography>
                            </Stack>
                            <Stack direction={"row"} spacing={0.3} alignItems={"center"}>
                                <ModeCommentOutlinedIcon style={{ color: "lightgreen", fontSize: 18 }} />
                                <Typography variant="caption">{post?.comments}</Typography>
                            </Stack>
                        </Stack>
                        <Stack direction={"row"} pt={0.5} justifyContent={"flex-start"}>
                            {(post?.tags)?.map((tag, index) => {
                                return <Chip
                                    key={index}
                                    label={tag?.tag_name}
                                    style={{
                                        fontSize: 10,
                                        padding: 0,
                                        color: "inherit",
                                        borderRadius: 30,
                                        height: 20,
                                        backgroundColor: "#999000",
                                        marginRight: 6,
                                        marginTop: 0,
                                        marginLeft: 0,
                                    }}
                                />
                            })}
                        </Stack>
                    </Stack>
                }
                style={{
                    backgroundColor: "rgb(37 51 88)",
                    color: "lightgray",
                }}
            />
        </Card>
    )
}