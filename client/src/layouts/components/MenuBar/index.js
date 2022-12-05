import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

import { useNoti, useStore } from "../../../store/hooks";
import { useSocket } from "../../../store/hooks";

import { Box, Stack } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import MaterialUISwitch from "../../../components/MaterialUISwitch";
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import GroupsIcon from '@mui/icons-material/Groups';
import ExploreIcon from '@mui/icons-material/Explore';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

import AccountMenu from "../AccountMenu";

const logoLink = process.env.PUBLIC_URL + "/assets/img/logo.png";

export default function MenuBar() {
    const [state,] = useStore();
    const [notiState,] = useNoti();
    const [socketState,] = useSocket();
    const socket = socketState.instance;
    const location = useLocation();
    const [selected, setSelected] = useState('/' + location.pathname.split('/')[1]);

    useEffect(() => {
        socket.emit("subscribe", state.user.id);
    }, [socket, state.user.id])

    useEffect(() => {
        setSelected('/' + location.pathname.split('/')[1]);
    }, [location])

    const NavButtons = [
        {
            path: "/home",
            element: <HomeIcon />,
            badge: false,
        },
        {
            path: "/notifications",
            element: <NotificationsIcon />,
            badge: null,
        },
        {
            path: "/chat",
            element: <MailIcon />,
            badge: notiState?.badge?.message,
        },
        {
            path: "/channels",
            element: <GroupsIcon />,
            badge: false,
        },
        {
            path: "/posts",
            element: <MenuBookIcon />,
            badge: false,
        },
        {
            path: "/explore",
            element: <ExploreIcon />,
            badge: false,
        }
    ]

    return (
        <Box
            sx={{
                width: "5%",
                height: "100vh",
                zIndex: 999,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            }}
        >
            <Stack
                direction="column"
                alignItems={"center"}
                spacing={1}
                sx={{
                    width: "100%",
                }}
            >

                <IconButton
                    size="large" color="inherit"
                    component={Link} to="/"
                >
                    <img
                        alt="Logo"
                        style={{
                            width: 100,
                            marginTop: -12,
                            marginBottom: -30,
                        }}
                        src={logoLink}
                    />
                </IconButton>

                {
                    NavButtons.map((obj, index) => {
                        let boxSx = {};
                        let iconSx = {}
                        if (obj.path === selected) {
                            boxSx = {
                                bgcolor: "#3f51b5",
                                borderRadius: 3.5,
                            }
                            iconSx = {
                                //color: "red", 
                            }
                        }
                        return <Box
                            key={index}
                            sx={boxSx}
                        >
                            <IconButton
                                key={index}
                                size="large" color="inherit"
                                component={Link} to={obj.path}
                                sx={iconSx}
                                onClick={() => { setSelected(obj.path) }}
                                style={{
                                    pointerEvents: (selected === obj.path) ? "none" : "auto",
                                }}
                            >
                                {obj.badge
                                    ? <Badge badgeContent={obj.badge} color="error">
                                        {obj.element}
                                    </Badge>
                                    : obj.element}
                            </IconButton>
                        </Box>
                    })
                }

            </Stack>

            <Stack
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: 2,
                }}
            >
                <Box
                    sx={{
                        alignSelf: "center",
                    }}
                >
                    <FormControlLabel
                        control={
                            <MaterialUISwitch
                                sx={{
                                    marginLeft: 4,
                                }}
                                defaultChecked />
                        }
                    />
                </Box>
                <Box>
                    <AccountMenu />
                </Box>
            </Stack>
        </Box>
    )
}