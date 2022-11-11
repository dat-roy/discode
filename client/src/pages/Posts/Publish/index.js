import React from "react";
import { useState } from "react";
//import LZString from 'lz-string';
import { useNavigate } from "react-router-dom"

import { useStore } from "../../../store/hooks"

import { Box } from "@mui/system";
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
    //const [tagData, setTagData] = useState();
    const [editorHtml, setEditorHtml] = useState('');
    const [title, setTitle] = useState('');

    const handlePublishNewPost = () => {
        if (title === '') {
            return toast.error("Title can not be empty")
        }
        if (editorHtml === '' || editorHtml === '<p><br></p>') {
            return toast.error("Content can not be empty")
        }
        handlePublishNewPostAPI({
            author_id: state.user.id,
            title: title, 
            content: editorHtml,
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
            <Box
                sx={{
                    width: "70%",
                    margin: "auto"
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
                    id="standard-basic" label="Title" variant="standard"
                    value={title}
                    onChange={(input) => setTitle(input.target.value)}
                />
                <Tags />
                <TextEditor
                    placeholder={"Write something..."}
                    editorHtml={editorHtml}
                    setEditorHtml={setEditorHtml}
                />
                <Button
                    onClick={handlePublishNewPost}
                    sx={{
                        marginBottom: 2
                    }}
                >
                    Publish
                </Button>
            </Box>
        </Box>
    )
}