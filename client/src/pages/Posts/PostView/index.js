import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../../store/hooks";

import { CircularProgress, Grid, Stack } from "@mui/material";

import PageNotFound from '../../PageNotFound';
import PostContent from "./PostContent";
import PostLeft from "./PostLeft";
import PostRight from "./PostRight";

import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.snow.css';
import {
    handleGetPostByIdAPI
} from "../../../services";
import { toast } from "react-toastify";

export default function PostView() {
    const params = useParams();
    const post_id = parseInt(params.id);
    const [state,] = useStore();
    const [loading, setLoading] = useState(true);

    const [postData, setPostData] = useState({});
    const [author, setAuthor] = useState({});

    useEffect(() => {
        handleGetPostByIdAPI(post_id)
            .then(res => {
                setPostData(res.data?.post);
                setAuthor(res.data?.author);
            })
            .catch(err => {
                return toast.error(err.message);
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 300)
            })
    }, [params, post_id, state.user.id])

    if (!loading && !postData?.id) {
        return (
            <PageNotFound />
        )
    }

    if (loading) {
        return <Stack alignItems={"center"} pt={5}>
            <CircularProgress size={30}/>
        </Stack>
    }

    return (
        <Grid container spacing={0}
            sx={{
                width: "100%",
                height: "100vh",
                border: "1px solid #3E4042",
                overflowY: "auto",
            }}
        >
            <Grid item xs
                style={{
                    position: "sticky",
                    top: 0,
                    left: 0,
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
                }}
            >
                <PostContent
                    postData={postData}
                    author={author}
                />
            </Grid>
            <Grid item xs>
                <PostRight
                    author={author}
                />
            </Grid>
        </Grid>
    )
}