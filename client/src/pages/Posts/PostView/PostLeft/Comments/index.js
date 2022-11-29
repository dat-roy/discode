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

export default function Comments({ anchor, commentList }) {
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const [comments, setComments] = useState([])

    useEffect(() => {
        //Get children of comments 
        const res = []
        for (const comment of commentList) {
            comment.children = []
            comment.level = 1
        }
        for (const comment of commentList) {
            if (!comment?.parent_comment_id) {
                res.push(comment)
            } else {
                for (const parent of commentList) {
                    if (parent.id === comment?.parent_comment_id) {
                        comment.level = parent.level + 1;
                        parent.children.push(comment);
                    }
                }
            }
        }
        setComments(res)
    }, [commentList])

    useEffect(() => {
        if (comments) {
            console.log(comments);
        }
    }, [comments])

    const toggleDrawer = (anchor, open) => () => {
        setState({ ...state, [anchor]: open });
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
                Comments ({commentList.length})
            </Typography>
            <Box id="main-comment-box">
                <CommentBox
                    commentType={CommentTypes.PARENT}
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
        <Fragment key={anchor}>
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
        </Fragment>
    );
}