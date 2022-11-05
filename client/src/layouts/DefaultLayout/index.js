import React from'react';
import { Box } from "@mui/system";

import MenuBar from '../components/MenuBar';
import { Outlet } from 'react-router-dom';

export default function DefaultLayout() {
    return(
        <Box className="homeContainer"
            sx={{
                minWidth: 100, 
                minHeight: 100, 
                top: 0, 
                bottom: 0,
                left: 0, 
                right: 0, 
                position: "fixed",
                display: "flex",
                justifyContent: "flex-start"
            }}
        >  
            <MenuBar />
            <Outlet />
        </Box>
    ) 
}