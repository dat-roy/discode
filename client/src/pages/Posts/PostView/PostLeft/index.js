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
        postData, author,
    } = props;

    const post_id = postData.id;

    const [state,] = useStore();

    const [likesNumber, setLikesNumber] = useState(0);
    const [liked, setLiked] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [commentNum, setCommentNum] = useState(0);

    useEffect(() => {
        setCommentNum(commentList?.length);
    }, [commentList])

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
                    setCommentList(res.data?.comments)
                })
                .catch(err => {
                    return toast.error(err.message)
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
            <Stack padding={5} alignItems={"center"} justifyContent={"space-between"} spacing={0.4}>
                <Typography variant={"h6"} fontWeight={600} pb={2}>
                    About:
                </Typography>
                <Link to={`/profile?username=${author?.username}`}>
                    <Avatar
                        alt={author?.username}
                        src={author?.avatar_url}
                    />
                </Link>
                {
                    (state.user.id === author?.id) ? null
                        : <Button
                            variant="outlined"
                        >
                            Follow
                        </Button>
                }
                <Typography
                    variant={"subtitle2"}
                    align={'center'}
                    style={{
                        color: "lightgray",
                        wordWrap: "break-word",
                        whiteSpace: 'pre-line',
                        overflow: "hidden",
                        width: "240px",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "5",
                        WebkitBoxOrient: "vertical",
                    }}
                    title={author?.description}
                >
                    {author?.description}
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
                    width={"100%"}
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
                                    : <FavoriteBorderIcon sx={{ color: "pink" }} />
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
                            commentNum={commentNum}
                            setCommentNum={setCommentNum}
                        />
                        <Typography>
                            {commentNum}
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