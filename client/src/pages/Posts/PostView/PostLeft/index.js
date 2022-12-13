import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    handleCheckLikedAPI, handleGetCommentsAPI, handleGetLikesNumberAPI, handleToggleLikeButtonAPI
} from "../../../../services";
import { useStore } from "../../../../store/hooks";

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { Avatar, Chip, Divider, IconButton, Stack, Typography } from "@mui/material";
import { toast } from 'react-toastify';
import Comments from "./Comments";

export default function PostLeft(props) {
    const {
        postData, author,
    } = props;

    const post_id = postData.id;
    const navigate = useNavigate();

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
        <Stack maxWidth={"100%"}>
            <Stack pl={0.7} pt={1} direction={"row"} alignItems={"center"}>
                <IconButton style={{ color: "lightgray" }}
                    onClick={() => navigate(`/posts`)}
                >
                    <ArrowBackIcon style={{ fontSize: 20, }} />
                </IconButton>
                <Typography variant='caption' fontSize={16} style={{ color: "lightgray" }}>
                    Back
                </Typography>
            </Stack>
            <Stack padding={5} alignItems={"left"} justifyContent={"space-between"} spacing={0.4}>
                <Stack>
                    <Typography variant={"h6"} fontWeight={700} pb={2}
                        style={{
                            lineHeight: "28.8px",
                            letterSpacing: "1.5px",
                        }}
                    >
                        About:
                    </Typography>
                    <Stack direction={"row"} spacing={2}>
                        <Link to={`/profile?username=${author?.username}`}>
                            <Avatar
                                alt={author?.username}
                                src={author?.avatar_url}
                            />
                        </Link>
                        <Stack>
                            <Typography variant="subtitle2" style={{
                                fontSize: 14, fontWeight: 500, color: "yellow",
                                letterSpacing: "1.5px",
                                lineHeight: "20px",
                            }}>
                                @{author?.username}
                            </Typography>
                            <Typography variant="subtitle2" style={{
                                fontSize: 13, fontWeight: 400, color: "#DADEED",
                                letterSpacing: "1.5px",
                                lineHeight: "20px",
                            }}>
                                Student.
                            </Typography>
                        </Stack>
                    </Stack>
                    <Typography
                        variant={"subtitle2"}
                        pt={2}
                        style={{
                            color: "lightgray",
                            wordWrap: "break-word",
                            whiteSpace: 'pre-line',
                            overflow: "hidden",
                            width: "240px",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "10",
                            WebkitBoxOrient: "vertical",
                            lineHeight: "23px",
                            letterSpacing: "0.5px",
                            fontWeight: 400,
                        }}
                        title={author?.description}
                    >
                        {author?.description}
                    </Typography>
                </Stack>


                <br />
                <Divider color={"gray"} />
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