import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Stack, Avatar, Typography, IconButton, Divider } from "@mui/material"
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import { Accordion, AccordionDetails, AccordionSummary } from '../../../components/Accordion';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { toast } from "react-toastify";
import { handleGetUserByIdAPI } from "../../../services";

export default function ChatDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [otherUser, setOtherUser] = useState(null);

    const otherID = parseInt(params.id);

    useEffect(() => {
        if (location.state?.partner_data) {
            setOtherUser(location.state?.partner_data)
        } else {
            if (!otherUser && otherID) {
                handleGetUserByIdAPI(otherID)
                    .then(res => {
                        setOtherUser(res.data?.user_data);
                    })
                    .catch(err => {
                        return toast.error(err.message);
                    })
            }
        }
    }, [location.state?.partner_data, navigate, otherID, otherUser])

    if (!otherID) {
        return null;
    }
    return (
        <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"space-around"}
            spacing={1}
            p={4}
            style={{
                maxHeight: "95vh",
                overflowX: "hidden",
                overflowY: "scroll",
                marginBottom: 2,
            }}
        >

            <Stack
                width={"100%"}
                alignItems={"center"}
                justifyContent={"space-between"}
                spacing={0.9}
                pt={2} pb={2}
                borderRadius={2}
                bgcolor={"rgb(91 177 214 / 10%)"}
            >

                <Typography
                    variant={"h6"}
                    pb={2}
                    style={{ fontWeight: 600 }}
                >
                    Contact Info:
                </Typography>

                <Stack
                    width={"75%"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    spacing={0.9}
                >
                    <Avatar
                        src={otherUser?.avatar_url}
                        style={{
                            width: 80,
                            height: 80,
                        }}
                    />
                    <Typography variant={"h6"}>
                        <Link to={`/profile/?username=${otherUser?.username}`}
                            style={{
                                textDecoration: "none",
                                color: "#ffee33",
                            }}
                        >
                            @{otherUser?.username}
                        </Link>
                    </Typography>
                    <Typography
                        style={{
                            color: "orange"
                        }}
                    >
                        <i>{otherUser?.email}</i>
                    </Typography>
                    <Stack
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        spacing={5}
                    >
                        <Stack alignItems={"center"}>
                            <IconButton
                                style={{ color: "white" }}
                            >
                                <CallIcon />
                            </IconButton>
                            <Typography>Call</Typography>
                        </Stack>
                        <Stack alignItems={"center"}>
                            <IconButton
                                style={{ color: "white" }}
                            >
                                <VideocamIcon />
                            </IconButton>
                            <Typography>Video</Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack
                    style={{
                        width: "100%",
                        wordWrap: "break-word",
                    }}
                    p={2}
                    justifyContent={"left"}
                >
                    <Stack pl={3} pr={3}>
                        <Divider color={"lightgray"} style={{marginBottom: 10, }}/>
                        <Typography><b>About:</b> A simple person.</Typography>
                        <Typography><b>Work:</b> Lottery retailer.</Typography>
                        <Typography><b>Work at:</b> University of Engineering and Technology - VNU</Typography>
                    </Stack>
                </Stack>
            </Stack>
            <CustomizedAccordions />
        </Stack >
    )
}

function CustomizedAccordions() {
    const [expanded, setExpanded] = useState('');
    const handleChange = (panel) => (_, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <Box
            style={{
                width: "100%",
                border: "none",
            }}
        >
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}
                style={{
                    backgroundColor: "inherit",
                    color: "inherit",
                    border: "none",
                }}
            >
                <AccordionSummary
                    aria-controls="panel1d-content"
                    id="panel1d-header"
                    style={{ backgroundColor: "inherit" }}
                    IconProps={{
                        style: {
                            color: "white",
                            border: "none",
                        }
                    }}
                >
                    <Typography >Shared Media</Typography>
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        borderTop: "none", p: 2, pt: 0,
                    }}
                >
                    <ImageList cols={3} rowHeight={80}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
                            <ImageListItem key={index}>
                                <img
                                    src={`https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c`}
                                    loading={"lazy"}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}
                style={{
                    backgroundColor: "inherit",
                    color: "inherit",
                    border: "none",
                }}
            >
                <AccordionSummary
                    aria-controls="panel2d-content"
                    id="panel2d-header"
                    style={{ backgroundColor: "inherit" }}
                    IconProps={{
                        style: {
                            color: "white",
                            border: "none",
                        }
                    }}
                >
                    <Typography>Privacy & Support</Typography>
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        borderTop: "none",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="caption">
                        Nothing here :))
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}