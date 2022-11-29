import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { useStore } from "../../../store/hooks";

import { Grid } from "@mui/material";

import PostLeft from "./PostLeft";
import PostContent from "./PostContent";
import PostRight from "./PostRight";
import PageNotFound from '../../PageNotFound'

import {
    handleGetPostByIdAPI,
} from "../../../services"
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css'
import "highlight.js/styles/atom-one-light.css";

export default function PostView() {
    const params = useParams();
    const post_id = parseInt(params.id);
    const [state,] = useStore();

    const [postData, setPostData] = useState({});

    useEffect(() => {
        handleGetPostByIdAPI(post_id)
            .then(res => {
                //console.log(res.data?.post);
                setPostData(res.data?.post);
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
                bgcolor: "white",
                color: "black"
            }}
        >
            <Grid item xs>
                <PostLeft
                    postData={postData}
                />
            </Grid>
            <Grid item xs={6}
                sx={{
                    height: "100vh",
                    overflowY: "scroll",
                }}
            >
                <PostContent
                    postData={postData}
                />
            </Grid>
            <Grid item xs>
                <PostRight
                    postData={postData}
                />
            </Grid>
        </Grid>
    )
}