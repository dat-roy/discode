import React, { useState } from 'react';
import moment from 'moment';
import Box from '@mui/material/Box';
import {
    Stack, Button, IconButton,
    Typography, Avatar,
} from "@mui/material";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ReplyIcon from '@mui/icons-material/Reply';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CommentBox from '../CommentBox';
import { CommentTypes } from '../../../../../../types/comment.type'

export default function CommentElement({
    postId, comment, handleAppendNewComment
}) {
    const maxChar = 180;
    const [liked, setLiked] = useState(false);
    const [likesNumber, setLikesNumber] = useState(Math.floor(Math.random() * 20))
    const [showMore, setShowMore] = useState(false);
    const [openCommentBox, setOpenCommentBox] = useState(false);
    const [openReplyComments, setOpenReplyComments] = useState(false);

    const sent_at = moment(comment?.created_at).fromNow();

    const countTotalReplyComments = (parent) => {
        if (!parent) return 0;
        if (!parent?.children || !parent?.children?.length) return 0;
        
        let total = 0;
        for (const child of parent.children) {
            total += countTotalReplyComments(child)
        }
        return (parent.children).length + total;
    }

    if (!comment) return null;
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
                        <IconButton
                            onClick={() => {
                                if (comment?.children.length) {
                                    setOpenReplyComments(old => !old)
                                }
                            }}
                        >
                            <QuestionAnswerIcon
                                style={{ color: "" }}
                            />
                        </IconButton>
                        <Typography marginLeft={-0.3}>
                            {(openReplyComments) ? "Hide"
                                : (countTotalReplyComments(comment))} replies
                        </Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"}>
                    <Button
                        onClick={() => { if (!openCommentBox) return setOpenCommentBox(true) }}
                        disabled={(comment.level >= 4) ? true : false}
                    >
                        <ReplyIcon />
                        <Typography marginLeft={0.5}>Reply</Typography>
                    </Button>
                </Stack>
            </Stack>
            {
                !openCommentBox ? null
                    : <Box sx={{ paddingLeft: 8 }}>
                        <CommentBox
                            postId={postId}
                            commentType={CommentTypes.REPLY}
                            parentCommentId={comment?.id}
                            parentCommentUsername={comment?.username}
                            setOpenCommentBox={setOpenCommentBox}
                            handleAppendNewComment={handleAppendNewComment}
                        />
                    </Box>
            }

            {
                !openReplyComments ? null
                    : <Stack
                        sx={{ paddingLeft: 8 }}
                    >
                        {comment.children.map((child, index) => {
                            return <CommentElement
                                key={index}
                                postId={postId}
                                comment={child}
                                handleAppendNewComment={handleAppendNewComment}
                            />
                        })}
                    </Stack>
            }
        </Stack>
    )
}