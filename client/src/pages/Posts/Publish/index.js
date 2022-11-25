import React, { useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"

import { useStore } from "../../../store/hooks"

import { Box, Stack } from "@mui/system";
import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Tags from "../../../components/Tags";
import TextEditor from "../../../components/TextEditor";
import { handlePublishNewPostAPI } from "../../../services/post";

export default function Publish() {
    const navigate = useNavigate();
    const [state,] = useStore();
    const [tags, setTags] = useState([]);
    const [editorHtml, setEditorHtml] = useState('');
    const title = useRef();

    const handlePublishNewPost = () => {
        if (title.current.value === '') {
            return toast.error("Title can not be empty")
        }
        if (tags.length === 0) {
            return toast.error("Choose at least one tag please")
        }
        if (editorHtml === '' || editorHtml === '<p><br></p>') {
            return toast.error("Content can not be empty")
        }
        //console.log(tags);
        return console.log(editorHtml);
        handlePublishNewPostAPI({
            author_id: state.user.id,
            title: title.current.value,
            content: editorHtml,
            tag_list: tags,
        })
            .then((res) => {
                toast.success("Publish new post successfully")
                setTimeout(() => {
                    navigate(`/posts/view/${res.data?.post_id}`)
                }, 2500)
                console.log(res);
            })
    }

    return (
        <Box
            component="form"
            sx={{
                width: "100%",
                height: "100vh",
                overflowY: "scroll",
            }}
            bgcolor={"white"}
            noValidate
            autoComplete="off"
        >
            <Stack
                spacing={3}
                style={{
                    width: "50%",
                    margin: "auto",
                    paddingTop: 5,
                }}
            >
                <ToastContainer
                    position="top-center"
                    autoClose={2500}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <TextField
                    id="title"
                    variant="standard"
                    multiline
                    placeholder="New post title here..."
                    style={{
                        width: "100%",
                    }}
                    inputProps={{
                        style: {
                            fontSize: 36,
                            paddingTop: 10,
                            paddingRight: 10,
                            fontWeight: 500,
                            letterSpacing: 0.5,
                            lineHeight: 1,
                        }
                    }}
                    inputRef={title}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' ||
                            (e.key === 'Enter' && e.shiftKey)) {
                            e.preventDefault();
                        }
                    }}
                />
                <Tags
                    tags={tags}
                    setTags={setTags}
                    maxSelections={4}
                    placeholder={"Add up to 4 tags..."}
                />
                <TextEditor
                    placeholder={"Write something..."}
                    editorHtml={editorHtml}
                    setEditorHtml={setEditorHtml}
                />

                <Button
                    onClick={handlePublishNewPost}
                    variant={"contained"}
                    style={{
                        width: "50%",
                        margin: "auto",
                    }}
                >
                    Publish
                </Button>
            </Stack>
        </Box>
    )
}