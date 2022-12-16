import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom"
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Chip, CircularProgress, Divider, Grid, Stack } from "@mui/material";
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
import SearchBar from "../../../components/SearchBar";

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
    const [loadingTab, setLoadingTab] = useState(true);
    const searchTextRef = useRef();

    useEffect(() => {
        handleGetHotPostsAPI()
            .then(res => {
                setHotPosts(res.data?.posts);
            })
            .catch(err => {
                return toast.error(err.message);
            })
            .finally(() => {
                setTimeout(() => {
                    setLoadingTab(false);
                }, 300)
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
                        }}
                    >
                        <Stack
                            id={"sticky-header"}
                            direction={"row"}
                            justifyContent={"space-between"}
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                pl: 2,
                                pr: 2,
                                position: "sticky",
                                top: 0,
                                bgcolor: "rgba(10, 25, 41, 0.8)",
                                backdropFilter: "blur(8px)",
                                zIndex: 1000, 
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

                            <Stack alignItems={"center"} justifyContent={"center"} pt={0} pb={0}>
                                <SearchBar
                                    inputRef={searchTextRef}
                                    placeholder={"Search posts..."}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && searchTextRef.current.value !== '') {
                                            navigate(`/posts/search?q=${searchTextRef.current.value}`);
                                            searchTextRef.current.value = '';
                                        }
                                    }}
                                />
                            </Stack>
                        </Stack>

                        <TabPanel value={value} index={0}>
                            {
                                loadingTab
                                    ? <Stack alignItems={"center"} mt={2}><CircularProgress size={30} /></Stack>
                                    : <Grid container
                                        rowGap={1}
                                        spacing={1.5}
                                        pb={4}
                                    >
                                        {(hotPosts?.length)
                                            ? hotPosts.map((post, index) => {
                                                return <Grid item key={index}>
                                                    <PostItem post={post} />
                                                </Grid>
                                            })
                                            : <NoData />
                                        }
                                    </Grid>
                            }
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
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        handleGetFeaturedAuthorAPI()
            .then(res => {
                setAuthors(res.data?.authors)
            })
            .catch(err => {
                return toast.error(err.message);
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 300)
            })
    }, [])
    return (
        <Stack spacing={1.5} mt={1.5}>
            <Typography variant={"h6"} style={{ fontSize: 18 }}>Featured Authors</Typography>
            {
                loading
                    ? <Stack alignItems={"center"} mt={2}><CircularProgress size={30} /></Stack>
                    : <Stack spacing={1.8}>
                        {authors?.map((author, index) => {
                            return <AuthorItem key={index} author={author} rank={index + 1} />
                        })}
                    </Stack>
            }
        </Stack>
    )
}

function FeaturedTopics() {
    const [tags, setTags] = useState([])
    useEffect(() => {
        handleGetFeaturedTopicsAPI()
            .then(res => {
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