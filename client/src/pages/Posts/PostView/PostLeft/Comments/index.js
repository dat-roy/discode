import React, { Fragment, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {
    Stack, IconButton,
    Typography, Divider,
} from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import CommentBox from './CommentBox';
import CommentElement from './CommentElement';
import { CommentTypes } from '../../../../../types/comment.type';
import { useStore } from '../../../../../store/hooks';

export default function Comments({ anchor, postId, commentList, commentNum, setCommentNum }) {
    const [anchorState, setAnchorState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const [state,] = useStore();
    const [comments, setComments] = useState([])

    useEffect(() => {
        //Get children of comments 
        let res = []
        for (const comment of commentList) {
            comment.children = []
            comment.level = 1
        }
        commentList.sort((a, b) => a.id - b.id)
        for (const comment of commentList) {
            if (!comment?.parent_comment_id) {
                res = [comment, ...res]
            } else {
                for (const parent of commentList) {
                    if (parent.id === comment?.parent_comment_id) {
                        comment.level = parent.level + 1;
                        parent.children = [comment, ...parent.children];
                    }
                }
            }
        }
        setComments(res)
    }, [commentList])

    const handleAppendNewComment = (params) => {
        const newComment = {
            post_id: postId,
            sender_id: state.user.id,
            username: state.user.username,
            avatar_url: state.user.avatar_url,
            children: [],
            ...params,
        }

        //Recursion for appending a new comment.
        const appendRecursion = (newOne, list) => {
            if (!list || list.length === 0) return;
            for (const elem of list) {
                if (elem.id === newOne?.parent_comment_id) {
                    newOne.level = elem.level + 1;
                    elem.children = [newOne, ...elem.children];
                    return;
                }
                appendRecursion(newOne, elem.children)
            }
        }

        if (!newComment?.parent_comment_id) {
            newComment.level = 1;
            setComments(old => [newComment, ...old])
        } else {
            const copyComments = [...comments]
            appendRecursion(newComment, copyComments);
            setComments(copyComments);
        }

        setCommentNum(old => old + 1);
    }

    const toggleDrawer = (anchor, open) => () => {
        setAnchorState({ ...anchorState, [anchor]: open });
    };

    const renderCommentBox = () => (
        <Stack
            sx={{
                width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 500,
                padding: 5,
            }}
            role="presentation"
            //onBackdropClick={toggleDrawer(anchor, false)}
            spacing={2}
            justifyContent={"space-between"}
        >
            <Typography
                variant="h6"
                style={{
                    fontWeight: 600,
                }}
            >
                Comments ({commentNum})
            </Typography>
            <Box id="main-comment-box">
                <CommentBox
                    postId={postId}
                    commentType={CommentTypes.PARENT}
                    handleAppendNewComment={handleAppendNewComment}
                />
            </Box>
            <Divider
                sx={{
                    borderStyle: 'solid',
                }}
            />
            <Stack direction={"column"} spacing={2}>
                {
                    comments.map((comment, index) => {
                        return <Fragment key={index}>
                            <CommentElement
                                key={index}
                                postId={postId}
                                comment={comment}
                                handleAppendNewComment={handleAppendNewComment}
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
        <Fragment key={anchor}>
            <IconButton onClick={toggleDrawer(anchor, true)}>
                <CommentIcon sx={{ color: "#1e88e5" }} />
            </IconButton>
            <Drawer
                anchor={anchor}
                open={anchorState[anchor]}
                onClose={toggleDrawer(anchor, false)}
            >
                {renderCommentBox()}
            </Drawer>
        </Fragment>
    );
}