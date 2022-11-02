import React from "react"
import { Link } from "react-router-dom"

import { Box } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import MaterialUISwitch from "../MaterialUISwitch";
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import GroupsIcon from '@mui/icons-material/Groups';

import AccountMenu from "../AccountMenu";
import logo from "../../assets/img/github_logo.svg"


function Item(props) {
    const { sx, ...other } = props;
    return (
        <Box
            sx={{
                padding: 1,
                margin: 1,
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
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <img
                            style={{
                                width: 50,
                            }}
                            src={logo}
                        />
                    </Link>
                </Item>
                <Item>
                    <HomeIcon
                        sx={{
                            fontSize: 30,
                        }}
                    />
                </Item>
                <Item>
                    <NotificationsIcon/>
                </Item>
                <Item>
                    <MarkunreadIcon/>
                </Item>
                <Item>
                    <GroupsIcon/>
                </Item>
                <Item>
                    <MenuBookIcon/>
                </Item>
                <Item>
                    <AddCircleIcon/>
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
                {/* <Item>
                    <FormControlLabel 
                        control={
                            <Switch 
                                sx={{
                                    marginLeft: 3,
                                }}
                            defaultChecked />
                        } label="" />
                </Item> */}
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
                {/* <Item>
                    <SettingsIcon
                        color="primary"
                        sx={{
                            fontSize: 30
                        }}
                    />
                </Item> */}
                <Item>
                    <AccountMenu/>
                </Item>
            </Box>
        </Box>
    )
}