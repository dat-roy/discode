import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { IconButton, Stack, TextField } from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';


export default function CommentBox({ anchor, commentNumber, }) {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const commentRef = React.useRef('')

    const toggleDrawer = (anchor, open) => (event) => {
        setState({ ...state, [anchor]: open });
    };

    const commentBox = () => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 500 }}
            role="presentation"
            onBackdropClick={toggleDrawer(anchor, false)}
        >
            <Box>
                {commentNumber} Comments
            </Box>
            <Box>
                <TextField
                    ref={commentRef}
                    id="filled-textarea"
                    placeholder="Placeholder"
                    multiline
                    variant="filled"
                />
            </Box>
            <Box>
                Comment List:
            </Box>
        </Box>
    );

    return (
        <React.Fragment key={anchor}>
            <IconButton onClick={toggleDrawer(anchor, true)}>
                <CommentIcon sx={{ color: "#1e88e5" }} />
            </IconButton>
            <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
            >
                {commentBox()}
            </Drawer>
        </React.Fragment>
    );
}