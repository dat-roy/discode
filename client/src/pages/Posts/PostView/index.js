import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { useStore } from "../../../store/hooks";

import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';

import PostSides from "./PostSides";
import PostContent from "./PostContent";
import PageNotFound from '../../PageNotFound'

import {
    handleGetPostByIdAPI,
} from "../../../services/post"
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
                //console.log("HightLight")
                //console.log(hljs.highlightAuto(res.data?.post.content).value)
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
            <ToastContainer
                position="top-center"
                autoClose={1800}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Grid item xs sx={{ border: "1px solid red" }}>
                <PostSides 
                    post_id={post_id}
                    postData={postData}
                    toast={toast}
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
            <Grid item xs sx={{ border: "1px solid red" }}>
                <Box></Box>
            </Grid>
        </Grid>
    )
}