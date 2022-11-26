import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Stack, Avatar, Typography, IconButton, Divider } from "@mui/material"
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import { Accordion, AccordionDetails, AccordionSummary } from '../../../components/Accordion'

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
                    .then(response => {
                        //console.log(response)
                        if (!response.data.user_data) {

                        } else {
                            setOtherUser(response.data.user_data);
                        }
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
                border: "1px solid red",
                maxHeight: "95vh",
                overflowX: "hidden",
                overflowY: "scroll",
                marginBottom: 2,
            }}
        >
            <Box style={{ width: "100%", border: "1px solid red" }}>
                <Typography
                    variant={"subtitle1"}
                    style={{ fontWeight: 600 }}
                >
                    Contact Info:
                </Typography>
            </Box>
            <Stack
                alignItems={"center"}
                justifyContent={"space-between"}
                spacing={1}
                style={{ border: "1px solid red" }}
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
                <Stack>
                    <Typography>About: a simple person.</Typography>
                    <Typography>Work: NodeJs Developer</Typography>
                    <Typography>Working at: University of Engineering and Technology</Typography>
                </Stack>
            </Stack>
            {/* <Divider variant="middle" color={"gray"}
                style={{ width: "100%" }} /> */}
            <CustomizedAccordions />
        </Stack >
    )
}

function CustomizedAccordions() {
    const [expanded, setExpanded] = useState('');
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <Box
            style={{
                width: "100%",
            }}
        >
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}
                style={{ 
                    backgroundColor: "inherit", 
                    color: "inherit", 
                }}
            >
                <AccordionSummary
                    aria-controls="panel1d-content"
                    id="panel1d-header"
                    style={{ backgroundColor: "inherit" }}
                    IconProps={{
                        style: {
                            color: "white", 
                        }
                    }}
                >
                    <Typography >Shared Media</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                        malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                        sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}
                style={{ 
                    backgroundColor: "inherit", 
                    color: "inherit", 
                }}
            >
                <AccordionSummary
                    aria-controls="panel2d-content"
                    id="panel2d-header"
                    style={{ backgroundColor: "inherit" }}
                    IconProps={{
                        style: {
                            color: "white", 
                        }
                    }}
                >
                    <Typography >Collapsible Group Item #2</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                        malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                        sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}