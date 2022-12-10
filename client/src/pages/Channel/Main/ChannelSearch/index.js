import { Avatar, Button, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PeopleIcon from '@mui/icons-material/People';
import { useStore } from "../../../../store/hooks";
import { handleSearchChannelAPI, handleRequestJoiningAPI } from "../../../../services";
import ChannelModal from "../../../../components/ChannelModal";
import SearchBar from "../../../../components/SearchBar";
import moment from "moment";

export default function ChannelSearch() {
    const [hasHighlight, setHasHighlight] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [channels, setChannels] = useState([]);
    const searchTextRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        handleSearchChannelAPI(searchParams?.get('q'))
            .then(res => {
                setChannels(res.data?.channels);
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
            <Stack width={"45%"} spacing={2}>
                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={2}
                >
                    <IconButton
                        style={{ color: "inherit" }}
                        onClick={() => {
                            navigate('/channels');
                        }}
                    >
                        <ArrowBackIcon style={{ color: "inherit", fontSize: 28, }} />
                    </IconButton>
                    <Typography variant="h5" style={{ fontWeight: 500 }}>
                        {
                            searchParams?.get('q')
                                ? (`${channels?.length || 0} channels for "${searchParams?.get('q')}"`)
                                : (`Let's search for your favourite channels.`)
                        }
                    </Typography>
                </Stack>
                <Stack>
                    <SearchBar
                        placeholder={"Explore communities"}
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

                <Stack pt={1} pb={7} spacing={1.5}>
                    <Stack width={"200px"}>
                        <Button onClick={() => setHasHighlight(old => !old)}
                            style={{ color: "yellow" }}
                        >Toggle highlight</Button>
                    </Stack>
                    {channels?.map((channel, index) => {
                        return <ChannelResultElem
                            key={index}
                            channel={channel}
                            searchText={searchParams?.get('q')}
                            hasHighlight={hasHighlight}
                        />
                    })}
                </Stack>
            </Stack>
        </Stack>
    )
}

function getHighlightedText(text, highlight) {
    // Split on highlight term and include term into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return <span> {parts.map((part, i) =>
        <span key={i}
            style={part.toLowerCase() === highlight.toLowerCase()
                ? { backgroundColor: "yellow", color: "black" } : {}}
        >
            {part}
        </span>)
    } </span>;
}

function ChannelResultElem({ channel, searchText, hasHighlight }) {
    const [openModal, setOpenModal] = useState(false);
    const highlightTitle = getHighlightedText(channel?.title, searchText);
    const highlightDescription = getHighlightedText(channel?.description, searchText);
    const [state,] = useStore();
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
        <Stack direction={"row"} spacing={1}
            height={160}
            style={{
                backgroundColor: "rgb(91 177 214 / 10%)",
                borderRadius: 10,
                cursor: "pointer",
            }}
            onClick={handleClickItem}
        >
            <img
                src={channel?.background_url}
                style={{
                    objectFit: "cover",
                    width: 250,
                    //height: "100%",
                    borderRadius: 16,
                    padding: 10,
                }}
                alt="channel-background"
            />
            <Stack flexGrow={1} padding={2}>
                <Avatar
                    src={channel?.avatar_url}
                    key={"channel-logo"}
                    style={{
                        width: 36,
                        height: 36,
                        border: "4px solid rgba(19, 47, 76, 0.4)",
                        borderRadius: 15,
                    }}
                />
                <Typography
                    variant={"subtitle2"}
                    fontWeight={600}
                    letterSpacing={1}
                    color={"orange"}
                >
                    {hasHighlight ? highlightTitle : channel?.title}
                </Typography>
                <Typography
                    variant={"caption"}
                    color={"lightgray"}
                    align={'left'}
                    style={{
                        wordWrap: "break-word",
                        whiteSpace: 'pre-line',
                        overflow: "hidden",
                        width: "300px",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical",
                    }}
                    title={channel?.description}
                >
                    {hasHighlight ? highlightDescription : channel?.description}
                </Typography>
                <Stack color={"gray"}>
                    <Typography variant="caption">
                        Created at: {moment(channel?.created_at).format('DD/MM/YYYY')}
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
                        {channel?.members_number} Members
                    </Typography>
                </Stack>
            </Stack>
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
        </Stack>
    )
}