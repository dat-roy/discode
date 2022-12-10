import React from 'react';
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import { Stack, Chip, Avatar, Card, CardHeader } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import CardMedia from '@mui/material/CardMedia';
import moment from "moment";

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
                //marginBottom: 4,
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
                image="https://scontent.fhan2-5.fna.fbcdn.net/v/t1.15752-9/317148613_1325253711560506_7042031332465161735_n.png?_nc_cat=107&ccb=1-7&_nc_sid=ae9488&_nc_ohc=kPpGdud764sAX-L-sKQ&tn=9CcJtFlzIttL4SQ0&_nc_ht=scontent.fhan2-5.fna&oh=03_AdRtsfjfCpHEcDVOjSHlL4yQmY1sFyrzXP6yQsxEyYGSQA&oe=63BBB739"
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
                        <Typography variant="caption">
                            {moment(post?.created_at).format("HH:mm (YYYY-MM-DD)")}
                        </Typography>

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