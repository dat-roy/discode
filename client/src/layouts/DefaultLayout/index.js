import React from'react';
import { Box } from "@mui/system";

import MenuBar from '../components/MenuBar';
import LeftBar from "../components/LeftBar";
import Main from '../components/Main';
import RightBar from "../components/RightBar";

export default function DefaultLayout({leftElement, mainElement, rightElement}) {
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
            <LeftBar>
                {leftElement}
            </LeftBar>
            <Main>
                {mainElement}
            </Main>
            <RightBar>
                {rightElement}
            </RightBar>
        </Box>
    ) 
}