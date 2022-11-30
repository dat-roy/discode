import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Stack, Avatar, Typography } from "@mui/material";
import ReactQuill from "react-quill";

export default function PostContent(props) {
    const { postData } = props;
    if (!postData) {
        return <></>
    }
    return (
        <Fragment>
            <Typography variant="h3" gutterBottom
                marginTop={10}
                //padding={2}
                textAlign={"center"}
            >
                {postData.title}
            </Typography>
            <Stack
                direction={"row"}
                spacing={2}
                marginLeft={3}
            >
                <Link to={`/profile?username=${postData?.username}`}>
                    <Avatar
                        alt={postData?.username}
                        src={postData?.avatar_url}
                    />
                </Link>
                <Stack
                    spacing={0.2}
                >
                    <Typography variant="subtitle2">
                        @{postData?.username}
                    </Typography>
                    <Typography variant="caption">
                        {postData.created_at}
                    </Typography>
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
                    padding: "20px",
                }}
            />

            {/* An alternative... */}
            {/* <section
                    className="not-found-controller"
                    dangerouslySetInnerHTML={{ __html: postData.content }}
                /> */}
        </Fragment>
    )
}