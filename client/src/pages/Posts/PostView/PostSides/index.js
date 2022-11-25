import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../../../store/hooks";

import {
    handleCheckLikedAPI,
    handleToggleLikeButtonAPI, handleGetLikesNumberAPI,
    handleGetCommentsAPI
} from "../../../../services/post"

import { Box } from "@mui/system";
import { Divider, Chip, IconButton, Stack, Button } from "@mui/material";
import { Typography } from "@mui/material";
import { Avatar } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import CommentBox from "./CommentBox";

export default function PostSides(props) {
    const {
        post_id,
        postData,
        toast,
    } = props;

    const [state,] = useStore();

    const [likesNumber, setLikesNumber] = useState(0);
    const [liked, setLiked] = useState(false);
    const [commentNumber, setCommentNumber] = useState(0);
    const [commentList, setCommentList] = useState([]);

    useEffect(() => {
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
    }, [post_id, state.user.id])

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
        <Fragment>
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
        </Fragment>
    )
}