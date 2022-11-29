import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import {
    Stack, Button, IconButton, TextField,
    Typography, InputAdornment,
} from "@mui/material";
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { CommentTypes } from '../../../../../../types/comment.type';

export default function CommentBox(props) {
    const {
        commentType,
        parentCommentId,
        parentCommentUsername,
        setOpenCommentBox,
    } = props;

    const commentRef = useRef()
    const [canSend, setCanSend] = useState(false);
    const [emojiMartDisplay, setEmojiMartDisplay] = useState(false);

    const saveNewComment = () => {
        console.log(parentCommentId);
    }

    const handleCancel = () => {
        commentRef.current.value = '';
        setCanSend(false);
        if (commentType === CommentTypes.REPLY) {
            setOpenCommentBox(false);
        }
    }

    const handleSend = () => {
        saveNewComment();
        commentRef.current.value = '';
        setCanSend(false);
    }

    return (
        <Stack>
            <TextField
                inputRef={commentRef}
                placeholder={
                    (commentType === CommentTypes.PARENT)
                        ? `What are your thoughts? 😄`
                        : `You are replying to ${parentCommentUsername}`
                }
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
                        borderBottom: '0.8px dotted orange',
                        //width: "96%", 
                        //marginLeft: "2%",
                    },
                    '& .MuiInput-underline:hover:before': {
                        borderBottom: '0.8px dotted orange',
                        //width: "96%", 
                        //marginLeft: "2%",
                    },
                    '& .MuiInput-underline:after': {
                        borderBottomColor: 'orange',
                        //width: "96%", 
                        //marginLeft: "2%",
                    },

                    '& .MuiInput-underline:hover:after': {
                        borderBottom: "none",
                    }
                }}
                InputProps={{
                    startAdornment: <>
                        <InputAdornment
                            position="end"
                            style={{
                                marginLeft: 0,
                                marginRight: 5,
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
                        {(commentType === CommentTypes.PARENT)
                            ? "All your comments are appreciated"
                            : null}
                    </i>
                </Typography>
                <Stack
                    direction={"row"}
                    spacing={0.5}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <Button
                        onClick={handleCancel}
                        sx={{
                            color: "#f44336",
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disabled={(canSend ? false : true)}
                        onClick={handleSend}
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