import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Stack, Avatar, Typography, IconButton } from "@mui/material";
import ReactQuill from "react-quill";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function PostContent(props) {
    const { postData, author } = props;
    if (!postData) {
        return <></>
    }
    return (
        <Stack spacing={2}>
            <Typography variant="h4" gutterBottom
                marginTop={9}
                textAlign={"center"}
                style={{
                    fontSize: 40, fontWeight: 700, 
                    color: "lightblue",
                }}
            >
                {postData.title}
            </Typography>
            <Stack
                direction={"row"}
                spacing={2.5}
                alignItems={"center"}
                p={"12px 15px"}
            >
                <Link to={`/profile?username=${author?.username}`}>
                    <Avatar
                        alt={author?.username}
                        src={author?.avatar_url}
                        style={{
                            width: 50, height: 50, 
                        }}
                    />
                </Link>
                <Stack
                    spacing={0.2}
                    flexGrow={1}
                >
                    <Typography variant="subtitle2" style={{
                        fontSize: 18, fontWeight: 600, color: "yellow",
                    }}>
                        @{author?.username}
                    </Typography>
                    <Typography variant="caption" style={{
                        fontSize: 14, color: "lightgray", 
                    }}>
                        {postData.created_at}
                    </Typography>
                </Stack>
                <Stack direction={"row"}>
                    <IconButton style={{color: "inherit"}}>
                        <BookmarkBorderIcon />
                    </IconButton>
                    <IconButton style={{color: "inherit"}}>
                        <MoreHorizIcon />
                    </IconButton>
                </Stack>
            </Stack>
            <ReactQuill
                value={postData.content}
                readOnly={true}
                theme={"bubble"}
                modules={{
                    syntax: true,
                }}
                style={{
                }}
            />

            {/* An alternative... */}
            {/* <section
                    className="not-found-controller"
                    dangerouslySetInnerHTML={{ __html: postData.content }}
                /> */}
        </Stack>
    )
}