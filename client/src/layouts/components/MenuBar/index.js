import React from "react"
import { Link } from "react-router-dom"

import { Box } from '@mui/material';
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

const logoLink = process.env.PUBLIC_URL + "assets/img/github_logo.svg";

function Item(props) {
    const { sx, ...other } = props;
    return (
        <Box
            sx={{
                padding: 0,
                margin: 0.5,
                color: 'grey.300',
                borderRadius: 5,
                fontSize: '0.875rem',
                fontWeight: '700',
                ...sx,
            }}
            {...other}
        />
    )
}

export default function MenuBar() {
    return (
        <Box
            sx={{
                width: "5%",
                zIndex: 999,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRight: "0.2px solid #424242",
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: 1,
                }}
            >
                <Item>
                    <IconButton 
                        size="large" color="inherit"
                        component={Link} to="/"
                    >
                        <img
                            alt="Logo"
                            style={{
                                width: 50,
                            }}
                            src={logoLink}
                        />
                    </IconButton>
                </Item>
                <Item>
                    <IconButton 
                        size="large" aria-label="home page" color="inherit"
                        component={Link} to="/home"
                    >
                        <HomeIcon/>
                    </IconButton>
                </Item>
                <Item>
                    <IconButton 
                        size="large" color="inherit"
                        component={Link} to="/notifications"
                    >
                        <Badge badgeContent={1000} color="error">
                            <NotificationsIcon/>
                        </Badge>
                    </IconButton>
                </Item>
                <Item>
                    <IconButton 
                        size="large" color="inherit"
                        component={Link} to="/chat"
                    >
                        <Badge badgeContent={10} color="error">
                            <MailIcon/>
                        </Badge>
                    </IconButton>
                </Item>
                <Item>
                    <IconButton 
                        size="large" color="inherit"
                        component={Link} to="/channels"
                    >
                        <Badge badgeContent={1} color="error">
                            <GroupsIcon/>
                        </Badge>
                    </IconButton>
                </Item>
                <Item>
                    <IconButton 
                        size="large" color="inherit"
                        component={Link} to="/posts"
                    >
                        <MenuBookIcon/>
                    </IconButton>
                </Item>
                <Item>
                    <IconButton 
                        size="large" color="inherit"
                        component={Link} to="/explore"
                    >
                        <ExploreIcon/>
                    </IconButton>
                </Item>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: 2,
                }}
            >
                <Item
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
                </Item>
                <Item>
                    <AccountMenu/>
                </Item>
            </Box>
        </Box>
    )
}