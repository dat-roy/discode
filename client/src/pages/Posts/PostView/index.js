import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"
import { useStore } from "../../../store/hooks";

import { Box } from "@mui/system";
import { Divider, Chip, IconButton, Stack, Button } from "@mui/material";
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import { Avatar } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { ToastContainer, toast } from 'react-toastify';

import PageNotFound from '../../PageNotFound'

import { handleGetPostByIdAPI, handleCheckLikedAPI, 
    handleToggleLikeButtonAPI, handleGetLikesNumberAPI, 
    handleGetCommentsAPI } from "../../../services/post";
import CommentBox from "./CommentBox";

export default function PostView() {
    const params = useParams();
    const post_id = parseInt(params.id);
    const [state,] = useStore();

    const [postData, setPostData] = useState({});
    const [likesNumber, setLikesNumber] = useState(0);
    const [liked, setLiked] = useState(false);
    const [commentNumber, setCommentNumber] = useState(0);
    const [commentList, setCommentList] = useState([]);

    useEffect(() => {
        handleGetPostByIdAPI(post_id)
            .then(res => {
                //console.log(res.data?.post);
                setPostData(res.data?.post);
            })
        handleCheckLikedAPI(post_id, state.user.id)
            .then(res => {
                setLiked(res.data.liked)
                //console.log(res.data)
            })
        handleGetLikesNumberAPI(post_id)
            .then(res => {
                //console.log(res.data);
                setLikesNumber(res.data?.number)
            })
        handleGetCommentsAPI(post_id) 
            .then(res => {
                console.log(res.data);
            })
    }, [params, post_id, state.user.id])

    if (!postData) {
        return (
            <PageNotFound />
        )
    }

    const handleToggleLikeButton = () => {
        console.log(!liked);
        handleToggleLikeButtonAPI(post_id, state.user.id, !liked)
            .then(res => {
                if (res.data?.success) {
                    setLiked(!liked);
                    if (!liked) {
                        setLikesNumber(likesNumber + 1);
                    } else {
                        setLikesNumber(likesNumber - 1);
                    }
                } else {
                    return toast.error("Failed to connect to server")
                }
            })
    }

    return (
        <Grid container spacing={0}
            sx={{
                width: "100%",
                height: "100vh",
                bgcolor: "white",
                color: "black"
            }}
        >
            <ToastContainer
                position="top-center"
                autoClose={1800}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Grid item xs sx={{ border: "1px solid red" }}>
                <Stack direction={"column"}>
                    <Box padding={1}>
                        <Button href="#back">
                            Back
                        </Button>
                    </Box>
                    <Stack padding={5}>
                        <Typography variant={"h5"}>
                            Author:
                        </Typography>
                        <Link to={`/profile?username=${postData?.username}`}>
                            <Avatar
                                alt={postData?.username}
                                src={postData?.avatar_url}
                            />
                        </Link>
                        <Typography>
                            (Description) A simple person
                        </Typography>
                        <br />
                        <Stack direction={"row"}>
                            <Chip label="Javascript" />
                            <Chip label="DevOps" />
                        </Stack>
                        <br />
                        <Divider />
                        <Stack
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"space-around"}
                        >
                            <Stack
                                direction={"row"}
                                alignItems={"center"}
                            >
                                <IconButton onClick={handleToggleLikeButton}>
                                    {
                                        (liked) ? <FavoriteIcon sx={{ color: "red" }} />
                                            : <FavoriteBorderIcon />
                                    }
                                </IconButton>
                                <Typography>
                                    {likesNumber}
                                </Typography>
                            </Stack>

                            <Stack
                                direction={"row"}
                                alignItems={"center"}
                            >
                                <CommentBox
                                    anchor={"right"}
                                    commentNumber={commentNumber}
                                />
                                <Typography>
                                    {commentNumber}
                                </Typography>
                            </Stack>

                            <Stack
                                direction={"row"}
                                alignItems={"center"}
                            >
                                <IconButton>
                                    <ShareIcon sx={{ color: "#4caf50" }} />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </Grid>
            <Grid item xs={6}
                sx={{
                    height: "100vh",
                    overflowY: "scroll",
                }}
            >
                {
                    (postData) &&
                    <Fragment>
                        <Typography variant="h2" gutterBottom
                            marginTop={10}
                        >
                            {postData.title}
                        </Typography>
                        <Stack
                            direction={"row"}
                            spacing={2}
                            marginLeft={3}
                        >
                            <Link to={`/profile?username=${postData?.username}`}>
                                <Avatar
                                    alt={postData?.username}
                                    src={postData?.avatar_url}
                                />
                            </Link>
                            <Stack
                                spacing={0.2}
                            >
                                <Typography variant="subtitle2">
                                    @{postData?.username}
                                </Typography>
                                <Typography variant="caption">
                                    {postData.created_at}
                                </Typography>
                            </Stack>
                        </Stack>
                        <section
                            className="not-found-controller"
                            dangerouslySetInnerHTML={{ __html: postData.content }}
                        />
                    </Fragment>
                }
            </Grid>
            <Grid item xs sx={{ border: "1px solid red" }}>
                <Box></Box>
            </Grid>
        </Grid>
    )
}