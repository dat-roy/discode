import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, Stack } from "@mui/material";


import { ToastContainer, toast } from 'react-toastify';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};


export default function Feed() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid container spacing={0}
            sx={{
                width: "100%",
                height: "100vh",
                bgcolor: "white",
                color: "black"
            }}
        >
            <ToastContainer
                position="top-center"
                autoClose={1800}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Grid item xs={8} sx={{ border: "1px solid red" }}>
                <Box sx={{ padding: 6 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="Hot" />
                            <Tab label="Following" />
                            <Tab label="For you" />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        Hot
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        Following
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        For you
                    </TabPanel>
                </Box>
            </Grid>
            <Grid item xs sx={{ border: "1px solid red" }}>
                <Stack direction="column" height="100vh">
                    <Box height="50%" sx={{border: "1px solid red"}}>
                        <Typography>Featured Authors</Typography>
                    </Box>
                    <Box height="50%" sx={{border: "1px solid red"}}>
                        <Typography>Featured Posts</Typography>
                    </Box>
                </Stack>
            </Grid>
        </Grid>
    );
}