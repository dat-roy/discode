import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../../../store/hooks";

import {
    handleCheckLikedAPI,
    handleToggleLikeButtonAPI, handleGetLikesNumberAPI,
    handleGetCommentsAPI
} from "../../../../services"

import { Box } from "@mui/system";
import { Divider, Chip, IconButton, Stack, Button } from "@mui/material";
import { Typography } from "@mui/material";
import { Avatar } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Comments from "./Comments";
import { toast } from 'react-toastify';

export default function PostLeft(props) {
    const {
        postData,
    } = props;

    const post_id = postData.id;

    const [state,] = useStore();

    const [likesNumber, setLikesNumber] = useState(0);
    const [liked, setLiked] = useState(false);
    const [commentList, setCommentList] = useState([]);

    useEffect(() => {
        if (post_id) {
            handleCheckLikedAPI(post_id, state.user.id)
                .then(res => {
                    setLiked(res.data.liked)
                })
            handleGetLikesNumberAPI(post_id)
                .then(res => {
                    setLikesNumber(res.data?.number)
                })
            handleGetCommentsAPI(post_id)
                .then(res => {
                    //console.log(res.data);
                    setCommentList(res.data?.comments)
                })
        }
    }, [post_id, state.user.id])

    const handleToggleLikeButton = () => {
        handleToggleLikeButtonAPI(post_id, state.user.id, !liked)
            .then(res => {
                if (res.status !== 200 || !res.data?.success) {
                    throw new Error("Failed to connect to server")
                }
                setLiked(!liked);
                if (!liked) {
                    setLikesNumber(likesNumber + 1);
                } else {
                    setLikesNumber(likesNumber - 1);
                }
            })
            .catch(err => {
                return toast.error(err.message)
            })
    }

    return (
        <Stack>
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
                {
                    (state.user.id === postData.author_id) ? null
                        : <Button
                            variant="contained"
                        >
                            Follow
                        </Button>
                }
                <Typography>
                    (Description) A simple person
                </Typography>
                <br />
                <Stack direction={"row"} spacing={1}>
                    {postData?.tags?.map((tag, index) => {
                        return <Chip
                            key={index}
                            label={tag.tag_name}
                            style={{
                                color: "inherit",
                                borderRadius: 30,
                                height: 28,
                                backgroundColor: "#ab5600"
                            }}
                        />
                    })}
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
                        <Comments
                            anchor={"right"}
                            postId={post_id}
                            commentList={commentList}
                        />
                        <Typography>
                            {commentList.length}
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
    )
}