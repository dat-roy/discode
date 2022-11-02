import React from "react";
import { useStore } from "../../store/hooks";
import MenuBar from "../../components/MenuBar";
import LeftBar from "../../components/LeftBar";
import Main from "../../components/Main";
import RightBar from "../../components/RightBar";

import { Box } from "@mui/system";

export default function Home() {
    const [state, dispatch] = useStore();

    return (
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
            <LeftBar />
            <Main />
            <RightBar />
        </Box>
    )   
} 