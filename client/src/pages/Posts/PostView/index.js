import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../../store/hooks";

import { Grid } from "@mui/material";

import PageNotFound from '../../PageNotFound';
import PostContent from "./PostContent";
import PostLeft from "./PostLeft";
import PostRight from "./PostRight";

import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.snow.css';
import {
    handleGetPostByIdAPI
} from "../../../services";

export default function PostView() {
    const params = useParams();
    const post_id = parseInt(params.id);
    const [state,] = useStore();

    const [postData, setPostData] = useState({});
    const [author, setAuthor] = useState({});

    useEffect(() => {
        handleGetPostByIdAPI(post_id)
            .then(res => {
                setPostData(res.data?.post);
                setAuthor(res.data?.author);
            })
    }, [params, post_id, state.user.id])

    if (!postData) {
        return (
            <PageNotFound />
        )
    }

    return (
        <Grid container spacing={0}
            sx={{
                width: "100%",
                height: "100vh",
                border: "1px solid #3E4042",
            }}
        >
            <Grid item xs
                style={{
                    //backgroundColor: "rgba(19, 47, 76, 0.4)"
                }}
            >
                <PostLeft
                    postData={postData}
                    author={author}
                />
            </Grid>
            <Grid item xs={7}
                sx={{
                    height: "100vh",
                    overflowY: "auto",
                }}
            >
                <PostContent
                    postData={postData}
                    author={author}
                />
            </Grid>
            <Grid item xs
                style={{
                    //backgroundColor: "rgba(19, 47, 76, 0.4)"
                }}
            >
                <PostRight
                    author={author}
                />
            </Grid>
        </Grid>
    )
}