import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Chip, Divider, Grid, Stack } from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import AuthorItem from './AuthorItem';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import ControlledSpeedDial from "../../../components/ControlledSpeedDial"
import PostItem from './PostItem';
import { handleGetFeaturedAuthorAPI, handleGetFeaturedTopicsAPI, handleGetHotPostsAPI } from '../../../services/post';
import { toast } from "react-toastify";
import NoData from "../../../components/NoData";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

export default function Feed() {
    const navigate = useNavigate();
    const [value, setValue] = useState(0);
    const [hotPosts, setHotPosts] = useState([])

    useEffect(() => {
        handleGetHotPostsAPI()
            .then(res => {
                //console.log(res);
                setHotPosts(res.data?.posts);
            })
            .catch(err => {
                return toast.error(err.message);
            })
    }, [])

    const speedDialActions = [
        {
            icon: <BookmarkBorderIcon style={{ color: "blue" }} />, name: 'Saved',
        },
        {
            icon: <FavoriteBorderIcon style={{ color: "red" }} />, name: 'Love'
        },
        {
            icon: <AutoStoriesOutlinedIcon style={{ color: "orange" }} />, name: 'Yours'
        },
        {
            icon: <AddIcon style={{ color: "green" }} />, name: 'Create',
            onClick: function () {
                navigate('/posts/publish')
            }
        },
    ]

    return (
        <Grid container spacing={0}
            sx={{
                width: "100%",
                height: "100vh",
            }}
        >
            <Grid item xs={9}
                height={"100vh"}
                position={"relative"}
                borderLeft={"1px solid #3E4042"}
                borderRight={"1px solid #3E4042"}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        zIndex: 10,
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <ControlledSpeedDial
                        direction={'up'}
                        hidden={false}
                        actions={speedDialActions}
                        icon={<CreateIcon />}
                    />
                    <Box
                        sx={{
                            pl: 6,
                            pr: 6,
                            height: "100vh",
                            overflowY: "scroll",
                        }}>
                        <Box
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                pl: 2,
                                pr: 2,
                                position: "sticky",
                                top: 0,
                                bgcolor: "rgb(10, 25, 41)",
                            }}
                        >
                            <Tabs
                                value={value}
                                onChange={(_, newValue) => {
                                    setValue(newValue);
                                }}
                            >
                                <Tab label="Hot"
                                    style={{
                                        ...(value !== 0 && { color: "lightblue" })
                                    }}
                                />
                                <Tab label="Following"
                                    style={{
                                        ...(value !== 1 && { color: "lightblue" })
                                    }}
                                />
                                <Tab label="For you"
                                    style={{
                                        ...(value !== 2 && { color: "lightblue" })
                                    }}
                                />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <Stack
                                direction={"row"}
                                flex={"1 1 30%"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                                flexWrap={"wrap"}
                            >
                                {(hotPosts?.length)
                                    ? hotPosts.map((post, index) => {
                                        return <PostItem key={index}
                                            post={post}
                                        />
                                    })
                                    : <NoData />
                                }
                            </Stack>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <span style={{ color: "gray" }}>Comming soon...</span>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <span style={{ color: "gray" }}>Comming soon...</span>
                        </TabPanel>
                    </Box>
                </Box>

            </Grid>
            <Grid item xs>
                <Stack direction="column" height="100vh">
                    <Box height="50%" sx={{ padding: "0.6rem 1.5rem", }}>
                        <FeaturedAuthors />
                    </Box>
                    <Divider variant="middle" color={"gray"}
                        sx={{ borderStyle: 'dotted', borderBottomWidth: 0.5 }}
                    />
                    <Box height="50%" sx={{ padding: "0.6rem 1.5rem", }}>
                        <FeaturedTopics />
                    </Box>
                </Stack>
            </Grid>
        </Grid>
    );
}

function FeaturedAuthors() {
    const [authors, setAuthors] = useState([]);
    useEffect(() => {
        handleGetFeaturedAuthorAPI()
            .then(res => {
                //console.log(res);
                setAuthors(res.data?.authors)
            })
            .catch(err => {
                return toast.error(err.message);
            })
    }, [])
    return (
        <Stack spacing={1.5} mt={1.5}>
            <Typography variant={"h6"} style={{ fontSize: 18 }}>Featured Authors</Typography>
            <Stack spacing={1.8}>
                {authors?.map((author, index) => {
                    return <AuthorItem key={index} author={author} rank={index + 1} />
                })}
            </Stack>
        </Stack>
    )
}

function FeaturedTopics() {
    const [tags, setTags] = useState([])
    useEffect(() => {
        handleGetFeaturedTopicsAPI()
            .then(res => {
                //console.log(res);
                setTags(res.data?.tags);
            })
            .catch(err => {
                return toast.error(err.message);
            })
    }, [])
    return (
        <Stack spacing={1.5} mt={1.5}>
            <Typography variant={"h6"} style={{ fontSize: 18 }}>Featured Topics</Typography>
            <Stack
                direction="row"
                flex={"1 1 30%"}
                alignItems={"center"}
                spacing={1}
                justifyContent={"flex-start"}
                flexWrap={"wrap"}
            >
                {tags?.map((tag, index) => {
                    return <Chip
                        key={index}
                        label={tag?.tag_name}
                        style={{
                            color: "inherit",
                            borderRadius: 30,
                            height: 28,
                            backgroundColor: "#ab5600",
                            margin: 6,
                            marginTop: 0,
                            marginLeft: 0,
                        }}
                    />
                })}
            </Stack>
        </Stack>
    )
}