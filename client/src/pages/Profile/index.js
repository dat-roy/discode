import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import CodeIcon from '@mui/icons-material/Code';
import CreateIcon from '@mui/icons-material/Create';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import FemaleIcon from '@mui/icons-material/Female';
import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MaleIcon from '@mui/icons-material/Male';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PeopleIcon from '@mui/icons-material/People';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Avatar, Box, Button, Chip, Divider, Grid, IconButton, Link, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleGetUserByUsernameAPI } from "../../services";
import { useStore } from "../../store/hooks";
import { GenderTypes } from "../../types/db.type";
import PageNotFound from "../PageNotFound";
export default function Profile() {
    const navigate = useNavigate();
    const [state,] = useStore();
    const [userInfo, setUserInfo] = useState(null);
    const param = new URLSearchParams(useLocation().search).get("username");
    useEffect(() => {
        handleGetUserByUsernameAPI(param)
            .then(res => {
                setUserInfo(res.data?.user_data);
            })
            .catch(err => {
                return toast.error(err.message);
            })
    }, [param])

    if (!userInfo || !userInfo.username) {
        return <PageNotFound />
    }

    return (
        <Stack
            width={"100%"}
            height={"100vh"}
            overflow={"scroll"}
            borderLeft={"1px solid #3E4042"}
        >
            <Stack
                id={"backdrop"}
                minHeight={250}
                sx={{ bgcolor: "rgb(91 177 214 / 6%)" }}
            >
                <Box
                    style={{
                        height: "100%",
                        width: "74%",
                        margin: "auto",
                        backgroundImage: "url('https://media.istockphoto.com/photos/3d-abstract-background-with-ultraviolet-neon-lights-empty-frame-picture-id1191719793?b=1&k=20&m=1191719793&s=612x612&w=0&h=OMpsFvr6bZiuBkj0HnFyNNTU401COhP317Q_QSwmVpg=')",
                        backgroundSize: "cover",
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                    }}
                />
            </Stack>
            <Box position={"relative"}>
                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    spacing={3}
                    style={{
                        position: "absolute",
                        left: 240,
                        top: -25,
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    <Avatar
                        src={userInfo.avatar_url}
                        style={{
                            width: 110,
                            height: 110,
                            border: "8px solid #2244c847"
                        }}
                    />
                    <Stack direction={"row"} spacing={0.5} alignItems={"center"}>
                        <Typography
                            variant='h4'
                            style={{
                                color: "#479cff",
                                fontSize: 28,
                                fontWeight: 600,
                            }}
                        >
                            @{param}
                        </Typography>
                        {
                            userInfo?.gender === GenderTypes.FEMALE
                                ? <FemaleIcon style={{ fontSize: 28, color: "lightpink" }} />
                                : <MaleIcon style={{ fontSize: 28, color: "lightblue" }} />
                        }
                    </Stack>
                </Stack>


            </Box>

            <Box width={"100%"} bgcolor={"rgb(91 177 214 / 6%)"} mb={2}>
                <Stack
                    style={{
                        width: "68%",
                        margin: "auto",
                    }}
                    alignItems={"end"}
                    spacing={1}
                >
                    <Stack
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"flex-end"}
                        style={{
                            width: "60%",
                            minHeight: "110px",
                            float: "right",
                        }}
                        spacing={9}
                    >
                        <Stack alignItems={"center"} sx={{ color: "lightcoral" }}>
                            <Stack direction={"row"} alignItems={"center"} spacing={0.3} p={1}>
                                <PeopleIcon style={{ fontSize: 20 }} />
                                <Typography variant='body1'>100</Typography>
                            </Stack>
                            <Typography variant='subtitle1'>Followers</Typography>
                        </Stack>

                        <Stack alignItems={"center"} sx={{ color: "lightgreen" }}>
                            <Stack direction={"row"} alignItems={"center"} spacing={0.3} p={1}>
                                <RssFeedIcon style={{ fontSize: 20, }} />
                                <Typography variant='body1'>100</Typography>
                            </Stack>
                            <Typography variant='subtitle1'>Following</Typography>
                        </Stack>
                        <Stack alignItems={"center"} sx={{ color: "lightsteelblue" }}>
                            <Stack direction={"row"} alignItems={"center"} spacing={0.3} p={1}>
                                <CreateIcon style={{ fontSize: 20, }} />
                                <Typography variant='body1'>100</Typography>
                            </Stack>
                            <Typography variant='subtitle1'>Posts</Typography>
                        </Stack>
                    </Stack>

                    <Stack direction={"row"} justifyContent={"flex-end"} spacing={2} pb={1}>
                        <Button startIcon={<AddIcon />} variant={"contained"}
                            disabled={(state.user.username === param) ? true : false}
                            sx={{ borderRadius: 5, height: 36, bgcolor: "darkcyan" }}
                        >Follow</Button>
                        <Button startIcon={<MailOutlineIcon />} variant={"contained"}
                            disabled={(state.user.username === param) ? true : false}
                            sx={{
                                borderRadius: 5, height: 36, bgcolor: "seagreen",
                            }}
                            onClick={() => {
                                navigate(`/chat/${userInfo?.id}`);
                            }}
                        >
                            Chat
                        </Button>
                        <IconButton style={{ color: "inherit" }}><MoreVertIcon /></IconButton>
                    </Stack>
                </Stack>
            </Box>

            <Stack height={"100%"}>
                <Grid
                    container
                    width={"70%"}
                    height={"100%"}
                    margin={"auto"}
                >
                    <Grid item xs={7.5} pr={1}>
                        <Stack sx={{ bgcolor: "rgb(91 177 214 / 10%)", borderRadius: 2, }}
                            p={2.5}
                            spacing={2}
                        >
                            <Stack spacing={1.5}>
                                <Typography variant='h6' fontWeight={600}>About:</Typography>
                                <Typography variant='body1'
                                    style={{
                                        wordWrap: "break-word",
                                    }}
                                >
                                    {userInfo?.description}
                                </Typography>
                                <Divider width={"100%"} color={"gray"} />
                            </Stack>
                            <Stack id={"info"} spacing={1.5}>
                                <InfoItem type={"email"} text={userInfo?.email} />
                                <InfoItem type={"work"} text={"Student"} />
                                <InfoItem type={"workspace"} text={"University of Engineering and Technology - VNU"} />
                                <InfoItem type={"education"} text={"University of Engineering and Technology - VNU"} />
                                <InfoItem type={"address"} text={"Vietnam"} />
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs pl={1}>
                        <Stack sx={{ bgcolor: "rgb(91 177 214 / 10%)", borderRadius: 2, }}
                            p={2.5}
                            spacing={2}
                        >
                            <Typography variant='h6' fontWeight={600}>Links:</Typography>
                            <Stack id={"links"} spacing={1.5} pl={1}>
                                <LinkItem type={"github"} text={"https://github.com"} />
                                <LinkItem type={"linkedin"} text={"https://linkedin.com"} />
                                <LinkItem type={"facebook"} text={"https://facebook.com"} />
                                <LinkItem type={"youtube"} text={"https://youtube.com"} />
                                <LinkItem type={"code"} text={"https://leetcode.com"} />
                                <LinkItem type={"code"} text={"https://hackerrank.com"} />
                            </Stack>
                        </Stack>
                        <Stack sx={{ bgcolor: "rgb(91 177 214 / 10%)", borderRadius: 2, }}
                            p={2.5}
                            mt={2}
                            spacing={1.5}
                        >
                            <Typography variant='h6' fontWeight={600}>Interests:</Typography>
                            <Stack
                                direction="row"
                                alignItems={"center"}
                                spacing={1}
                                justifyContent={"flex-start"}
                                flexWrap={"wrap"}
                            >
                                {['Javascript', 'NodeJs', 'Typescript', 'Java', 'MongoDB', 'MySQL'].map((label, index) => {
                                    return <Chip
                                        key={index}
                                        label={label}
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
                    </Grid>
                </Grid>
            </Stack>
        </Stack>
    )
}

function InfoItem({ type, text }) {
    const getIcon = () => {
        switch (type) {
            case 'email':
                return <EmailIcon />
            case 'work':
                return <WorkIcon />
            case 'workspace':
                return <BusinessIcon />
            case 'education':
                return <SchoolIcon />
            case 'address':
                return <HomeIcon />
            default:
                return null;
        }
    }

    const getPretext = () => {
        switch (type) {
            case 'email':
                return "Email: "
            case 'work':
                return ""
            case 'workspace':
                return "Work at: "
            case 'education':
                return "Studies at: "
            case 'address':
                return "From: "
            default:
                return null;
        }
    }
    return (
        <Stack direction={"row"} spacing={2} alignItems={"center"} justifyContent={"flex-start"}>
            {(() => getIcon())()}
            <Typography
                variant='body1'
            >
                {(() => getPretext())()}
                <b>{text}</b>
            </Typography>
        </Stack>
    )
}

function LinkItem({ type, text }) {
    const getIcon = () => {
        switch (type) {
            case 'github':
                return <GitHubIcon style={{ fontSize: 26 }} />
            case 'linkedin':
                return <LinkedInIcon />
            case 'facebook':
                return <FacebookIcon />
            case 'youtube':
                return <YouTubeIcon />
            case 'code':
                return <CodeIcon />
            default:
                return null;
        }
    }
    return (
        <Stack direction={"row"} spacing={2} alignItems={"center"} justifyContent={"flex-start"}>
            {(() => getIcon())()}
            <Link href={text} underline="hover">
                <Typography
                    variant='body1'
                >
                    {text}
                </Typography>
            </Link>
        </Stack>
    )
}