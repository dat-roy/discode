import { Avatar, Button, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PeopleIcon from '@mui/icons-material/People';
import { handleSearchChannelAPI } from "../../../../services";
import SearchBar from "../../../../components/SearchBar";

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
        >
            <Stack width={"60%"}>
                <Stack
                    direction={"row"}
                    alignItems={"center"}
                >
                    <IconButton
                        style={{ color: "inherit" }}
                        onClick={() => {
                            navigate('/channels');
                        }}
                    >
                        <ArrowBackIcon style={{ color: "inherit" }} />
                    </IconButton>
                    <Typography>
                        {
                            searchParams?.get('q')
                                ? (`1000 channels for "${searchParams?.get('q')}"`)
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

                <Stack width={"200px"}>
                    <Button onClick={() => setHasHighlight(old => !old)}>Toggle highlight</Button>
                </Stack>

                <Stack>
                    {channels.map((channel, index) => {
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
    const highlightTitle = getHighlightedText(channel?.title, searchText);
    const highlightDescription = getHighlightedText(channel?.description, searchText);

    return (
        <Stack direction={"row"}>
            <Stack width={280} height={120} border={"1px solid red"}>
                <img
                    src={channel?.background_url}
                    style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "cover",
                    }}
                    alt="channel-background"
                />
            </Stack>
            <Stack>
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
                >
                    {hasHighlight ? highlightDescription : channel?.description}
                </Typography>
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
                <Stack color={"lightgray"}>
                    <Typography variant="caption">
                        Created at: 11/09/2003
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}