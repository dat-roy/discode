import React, { Fragment, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {
    Button, IconButton, TextField,
    Typography, InputAdornment, Divider, Avatar, useStepContext
} from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ReplyIcon from '@mui/icons-material/Reply';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Stack } from '@mui/system';

const CommentBox = () => {
    const commentRef = useRef()
    const [canSend, setCanSend] = useState(false);
    const [emojiMartDisplay, setEmojiMartDisplay] = useState(false);

    const saveNewComment = () => {

    }

    return (
        <Stack>
            <TextField
                inputRef={commentRef}
                placeholder="What are your thoughts? 😄"
                multiline
                variant="standard"
                onChange={() => {
                    if (commentRef.current.value === '') {
                        setCanSend(false);
                    } else {
                        setCanSend(true);
                    }
                }}
                style={{
                    width: "100%",
                }}
                sx={{
                    '& .MuiInput-root:hover': {
                        borderBottom: "none",
                    },
                    '& .MuiInput-underline:before': {
                        borderBottomColor: 'orange',
                        //borderBottom: "none", 
                    },
                    '& .MuiInput-underline:after': {
                        borderBottomColor: 'orange',
                        //borderBottom: "none", 
                    },
                }}
                InputProps={{
                    startAdornment: <>
                        <InputAdornment
                            position="end"
                            style={{
                                paddingLeft: 0,
                                paddingRight: 10,
                            }}
                        >
                            <IconButton
                                sx={{
                                    color: "#ffa000",
                                    position: "relative"
                                }}
                                onClick={() => { setEmojiMartDisplay(!emojiMartDisplay) }}
                            >
                                <SentimentSatisfiedRoundedIcon />
                            </IconButton>
                            <Box
                                sx={{
                                    zIndex: 1000,
                                    position: "absolute",
                                    top: 60,
                                    display: (emojiMartDisplay) ? "block" : "none",
                                }}
                            >
                                <Picker
                                    data={data}
                                    theme={"light"}
                                    onEmojiSelect={(e) => {
                                        commentRef.current.value += e.native;
                                    }}
                                    emojiButtonSize={40}
                                    emojiSize={20}
                                    onClickOutside={() => {
                                        if (emojiMartDisplay) {
                                            setEmojiMartDisplay(!emojiMartDisplay)
                                        }
                                    }}
                                />
                            </Box>
                        </InputAdornment>
                    </>
                }}
            />

            <Stack
                //alignItems={"center"}
                paddingTop={0.5}
                paddingLeft={0.5}
                paddingRight={0.5}
                direction="row"
                justifyContent={"space-between"}
            >
                <Typography
                    variant={"caption"}
                >
                    <i>
                        All your comments are appreciated
                    </i>
                </Typography>
                <Stack
                    width={"30%"}
                    direction={"row"}
                    spacing={0.5}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <Button
                        onClick={() => {
                            commentRef.current.value = '';
                            setCanSend(false);
                        }}
                        sx={{
                            color: "#f44336",
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disabled={(canSend ? false : true)}
                        onClick={() => {
                            saveNewComment();
                            commentRef.current.value = '';
                            setCanSend(false);
                        }}
                        sx={{
                            borderRadius: 5,
                            padding: 0.3,
                            paddingLeft: 1.8,
                            paddingRight: 1.8,
                            backgroundColor: "#66bb6a",
                            '&:hover': {
                                backgroundColor: "#81c784"
                            }
                        }}
                    >
                        Send
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    )
}

const CommentElement = ({ comment }) => {
    const maxChar = 180;
    const [liked, setLiked] = useState(false);
    const [likesNumber, setLikesNumber] = useState(Math.floor(Math.random() * 20))
    const [showMore, setShowMore] = useState(false);

    const sent_at = moment(comment?.created_at).fromNow();

    return (
        <Stack
            direction={"column"}
            spacing={1}
        >
            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                spacing={1.5}
            >
                <Box>
                    <Avatar
                        alt={"sender-avatar"}
                        src={comment?.avatar_url}
                    />
                </Box>
                <Stack
                    flexGrow={2}
                    direction={"column"}
                    alignItems={"start"}
                    justifyContent={"space-between"}
                    spacing={0.1}
                >
                    <Typography variant='subtitle1'><strong>@{comment?.username}</strong></Typography>
                    <Typography variant='caption'>{sent_at}</Typography>
                </Stack>

                <IconButton
                    onClick={() => { }}
                >
                    <MoreHorizIcon />
                </IconButton>
            </Stack>

            <Typography
                align={'left'}
                style={{
                    wordWrap: "break-word",
                    whiteSpace: 'pre-line',
                }}
            >
                {
                    (showMore || comment?.content?.length <= maxChar)
                        ? comment?.content
                        : `${comment?.content?.substring(0, maxChar)}...`
                }
                {
                    comment?.content?.length <= maxChar ? null
                        : <Button
                            onClick={() => setShowMore(!showMore)}
                        >
                            {showMore ? "Show less" : "Show more"}
                        </Button>
                }
            </Typography>

            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Stack direction="row" spacing={2}>
                    <Stack direction="row" alignItems="center">
                        <IconButton onClick={() => {
                            setLiked(!liked);
                            const delta = (liked) ? -1 : 1;
                            setLikesNumber(likesNumber + delta)
                        }}>
                            {
                                liked ? <ThumbUpAltIcon style={{ color: "#2196f3" }} />
                                    : <ThumbUpOffAltIcon />
                            }
                        </IconButton>
                        <Typography marginLeft={-0.3}>{likesNumber}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                        <IconButton>
                            <QuestionAnswerIcon style={{ color: "" }} />
                        </IconButton>
                        <Typography marginLeft={-0.3}>10 replies</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"}>
                    <Button>
                        <ReplyIcon />
                        <Typography marginLeft={0.5}>Reply</Typography>
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default function Comments({ anchor, commentList }) {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        setState({ ...state, [anchor]: open });
    };

    console.log(commentList)

    const renderCommentBox = () => (
        <Stack
            sx={{
                width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 500,
                padding: 5,
            }}
            role="presentation"
            onBackdropClick={toggleDrawer(anchor, false)}
            spacing={2}
            justifyContent={"space-between"}
        >
            <Typography
                variant="h6"
                style={{
                    fontWeight: 600,
                }}
            >
                Comments ({commentList.length})
            </Typography>
            <Box id="main-comment-box">
                <CommentBox />
            </Box>
            <Divider
                sx={{
                    borderStyle: 'solid',
                }}
            />
            <Stack direction={"column"} spacing={2}>
                {
                    commentList.map((comment, index) => {
                        return <Fragment key={index}>
                            <CommentElement
                                key={index}
                                comment={comment}
                            />
                            <Divider
                                sx={{
                                    borderStyle: 'dashed',
                                    margin: 2,
                                }}
                            />
                        </Fragment>
                    })
                }
            </Stack>
        </Stack>
    );

    return (
        <React.Fragment key={anchor}>
            <IconButton onClick={toggleDrawer(anchor, true)}>
                <CommentIcon sx={{ color: "#1e88e5" }} />
            </IconButton>
            <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
            >
                {renderCommentBox()}
            </Drawer>
        </React.Fragment>
    );
}