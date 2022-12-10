import React, { useState, useEffect, useRef } from "react";
import { Box, Card, CardMedia, CardContent, Stack, Typography, Avatar, Grid } from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import SearchBar from "../../../../components/SearchBar"
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleGetFeaturedChannelsAPI, handleRequestJoiningAPI } from "../../../../services";
import ChannelModal from "../../../../components/ChannelModal";
import { useStore } from "../../../../store/hooks";

export default function Discover() {
    const searchTextRef = useRef();
    const navigate = useNavigate();
    const [featuredChannels, setFeaturedChannels] = useState([]);

    useEffect(() => {
        handleGetFeaturedChannelsAPI()
            .then(res => {
                //console.log(res.data?.channels);
                setFeaturedChannels(res.data?.channels);
            })
            .catch(err => {
                return toast.error(err.message);
            })
    }, [])

    return (
        <Box
            sx={{
                height: "100vh",
                overflowY: "scroll"
            }}
        >
            <Stack
                direction="column" padding={5}
                spacing={4}
            >
                <Stack
                    height="340px"
                    textAlign="center"
                    alignItems={"center"}
                    justifyContent={"center"}
                    spacing={1.4}
                    position="relative"
                    id={"search-banner"}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${process.env.PUBLIC_URL + "assets/img/discover.png"})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPositionY: "0.1rem",
                            opacity: 0.8,
                            zIndex: -10,
                            borderRadius: 5,
                        }}
                    >
                    </Box>
                    <Typography variant="h4" fontWeight={600} fontSize={28} color="orange">
                        Find your community on Discode
                    </Typography>
                    <Typography variant="caption" fontSize={16} paddingBottom={3}>
                        From gaming, to music, to learning, there's a place for you.
                    </Typography>
                    <SearchBar
                        id={"search-bar"}
                        placeholder={"Explore channels"}
                        inputRef={searchTextRef}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && searchTextRef.current.value !== '') {
                                navigate(`/channels/search?q=${searchTextRef.current.value}`);
                                searchTextRef.current.value = '';
                            }
                        }}
                    />
                </Stack>
                <Stack>
                    <Typography variant="h6" pt={2} pb={2}>Featured Channels</Typography>
                    <Grid
                        container
                        rowGap={1}
                        spacing={1.5}
                    >
                        {featuredChannels?.map((channel, index) => {
                            return <Grid item key={index}>
                                <FeaturedChannelItem
                                    key={index}
                                    channel={channel}
                                />
                            </Grid>
                        })}
                    </Grid>
                </Stack>
                <Stack alignItems={"center"} pt={2}>
                    <TravelExploreIcon style={{ fontSize: 28, color: "lightblue" }} />
                    <Typography variant={"body1"}>There are more communities out there!</Typography>
                    <Box
                        component={'a'}
                        href={`#search-banner`}
                        sx={{
                            textDecoration: "none",
                            "&:visited": {
                                color: "cyan",
                            },
                            "&:active": {
                                color: "cyan",
                            },
                            "&:hover": {
                                color: "#7dffff",
                            },
                        }}
                    >
                        <Typography variant="body2">Try searching for them</Typography>
                    </Box>
                </Stack>
            </Stack>
        </Box>
    )
}

function FeaturedChannelItem({ channel }) {
    const [openModal, setOpenModal] = useState(false);
    const [state, ] = useStore();
    const [buttonLoading, setButtonLoading] = useState(false);
    const handleClickItem = () => {
        setOpenModal(true);
    }
    const handleSendJoinRequest = (e) => {
        e.stopPropagation();
        setButtonLoading(true);
        handleRequestJoiningAPI(state.user.id, channel?.admin_id, channel?.id)
            .then(res => {
                if (res.data?.joined) {
                    throw new Error("You have already joined this channel!")
                }
                if (res.data?.exist) {
                    throw new Error("You have already sent a request before!")
                }
                toast.success("Your request sent successfully");
            })
            .catch(err => {
                return toast.error(err.message);
            })
            .finally(() => {
                setTimeout(() => {
                    setButtonLoading(false);
                }, 1000)
            })
    }
    return (
        <Card
            onClick={handleClickItem}
            sx={{
                width: 245,
                borderRadius: 2,
                bgcolor: "inherit",
                color: "inherit",
                "&:hover": {
                    cursor: "pointer",
                    boxShadow: "4px 4px 11px rgba(33,33,33,.2)",
                }
            }}
        >
            <CardMedia
                component="img"
                height={130}
                image={channel?.background_url}
            />
            <Box
                key={"wrapper"}
                position={"relative"}
            >
                <Avatar
                    src={channel?.avatar_url}
                    key={"channel-logo"}
                    style={{
                        position: "absolute",
                        width: 50,
                        height: 50,
                        left: 0,
                        right: 0,
                        top: -35,
                        marginLeft: 16,
                        border: "4px solid rgba(19, 47, 76, 0.4)",
                        borderRadius: 15,
                    }}
                />
            </Box>
            <CardContent
                width="100%"
                sx={{
                    bgcolor: "rgba(19, 47, 76, 0.4)",
                    pl: 2.4, pr: 2.4,
                    pt: 4,
                    height: 100,
                }}
            >
                <Stack width={"100%"} height={"100%"}>
                    <Typography
                        variant={"subtitle2"}
                        fontWeight={600}
                        letterSpacing={1}
                        color={"yellow"}
                    >
                        {channel?.title}
                    </Typography>
                    <Typography
                        variant={"caption"}
                        color={"lightgray"}
                        style={{
                            wordWrap: "break-word",
                            whiteSpace: 'pre-line',
                            overflow: "hidden",
                        }}
                    >
                        {channel?.description}
                    </Typography>
                </Stack>
                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                    spacing={0.7}
                    color={"lightgreen"}
                    width={"100%"}
                >
                    <PeopleIcon style={{ fontSize: 16 }} />
                    <Typography
                        variant={"caption"}
                    >
                        {channel?.members} Members
                    </Typography>
                </Stack>
            </CardContent>

            <ChannelModal
                channel={channel}
                openModal={openModal}
                handleClose={e => {
                    e.stopPropagation();
                    setOpenModal(false);
                }}
                okText={"Join channel"}
                onOk={handleSendJoinRequest}
                cancelText={"Cancel"}
                onCancel={(e) => {
                    e.stopPropagation();
                    setOpenModal(false);
                }}
                buttonLoading={buttonLoading}
            />
        </Card>
    )
}