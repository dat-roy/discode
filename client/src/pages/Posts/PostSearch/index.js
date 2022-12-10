import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Grid, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchBar from "../../../components/SearchBar";
import { handleSearchPostsAPI } from "../../../services";
import { toast } from "react-toastify";
import PostItem from "../Feed/PostItem";

export default function PostSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const searchTextRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        handleSearchPostsAPI(searchParams?.get('q'))
            .then(res => {
                console.log(res);
                setPosts(res.data?.posts);
            })
            .catch(err => {
                return toast.error(err.message);
            })
    }, [searchParams])

    return (
        <Stack
            borderLeft={"1px solid #3E4042"}
            width={"100%"}
            height={"100vh"}
            alignItems={"center"}
            style={{
                overflowY: "scroll",
            }}
            pt={2}
        >
            <Stack width={"66%"} spacing={2}>
                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={2}
                >
                    <IconButton
                        style={{ color: "inherit" }}
                        onClick={() => {
                            navigate('/posts');
                        }}
                    >
                        <ArrowBackIcon style={{ color: "inherit", fontSize: 28, }} />
                    </IconButton>
                    <Typography variant="h5" style={{ fontWeight: 500 }}>
                        {
                            searchParams?.get('q')
                                ? (`${posts?.length || 0} posts for "${searchParams?.get('q')}" in the title`)
                                : (`Let's search for your favourite posts.`)
                        }
                    </Typography>
                </Stack>
                <Stack>
                    <SearchBar
                        placeholder={"Search for any posts"}
                        inputRef={searchTextRef}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && searchTextRef.current.value !== '') {
                                setSearchParams({
                                    q: searchTextRef.current.value,
                                });
                            }
                        }}
                    />
                </Stack>

                <Grid
                    container
                    rowGap={1}
                    spacing={1.5}
                    pb={6}
                >
                    {posts?.map((post, index) => {
                        return <Grid item key={index}>
                            <PostItem post={post} />
                        </Grid>
                    })}
                </Grid>
            </Stack>
        </Stack>
    )
}