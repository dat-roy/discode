import * as React from 'react';
import { useState } from 'react';
import { useSocket } from '../../../store/hooks';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

import { useStore } from '../../../store/hooks';
import { userActions } from '../../../store/actions/userActions'
import { useNavigate } from 'react-router-dom';

import AlertDialog from '../../../components/AlertDialog'
import { SocketActionTypes } from '../../../store/actions/constants';

export default function AccountMenu() {
    const [openDialog, setOpenDialog] = useState(false);
    const [state, dispatch] = useStore();
    const [, socketDispatch] = useSocket();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <Box>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="large"
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        aria-label="show account menu"
                        color="inherit"
                    >
                        <Avatar
                            alt={state.user.username}
                            src={state.user.avatar_url}
                            sx={{
                                width: 40,
                                height: 40,
                                "&:hover": {
                                    boxShadow: "2px 2px 10px #616161",
                                }
                            }}
                        />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        ml: 9,
                        mt: -1,
                        borderRadius: 4,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            bottom: 10,
                            left: -5,
                            width: 20,
                            height: 20,
                            //bgcolor: 'background.paper',
                            bgcolor: 'rgb(3 42 69)',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                        bgcolor: 'rgb(3 42 69)',
                        color: 'lightyellow',
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem
                    onClick={() => {
                        navigate(`/profile?username=${state.user.username}`);
                    }}
                >
                    <Avatar /> Profile
                </MenuItem>
                <Divider />
                <MenuItem>
                    <ListItemIcon>
                        <Settings fontSize="small" sx={{ color: "lightyellow" }} />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setOpenDialog(true);
                    }}
                >
                    <ListItemIcon>
                        <Logout fontSize="small" sx={{ color: "lightyellow" }} />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
            <AlertDialog
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                dialogTitle="Confirm your action:"
                dialogText="Are you sure you want to log out?"
                handleAgree={() => {
                    socketDispatch({ type: SocketActionTypes.DISCONNECT });
                    dispatch(userActions.userLogout());
                }}
            />
        </React.Fragment>
    );
}
