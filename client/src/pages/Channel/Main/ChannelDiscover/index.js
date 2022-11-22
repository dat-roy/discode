import { Box, Stack, Typography } from "@mui/material"
import SearchBar from "../../../../components/SearchBar"
export default function Discover() {
    return (
        <Box
            sx={{
                height: "100vh",
                overflowY: "scroll"
            }}
        >
            <Stack
                direction="column" padding={5}
                spacing={4}
            >
                <Stack
                    height="340px"
                    //border="1px solid red"
                    //borderRadius={5}
                    textAlign="center"
                    alignItems={"center"}
                    justifyContent={"center"}
                    spacing={1.4}
                    //color={"#1a237e"}
                    position="relative"
                >
                    <Box
                        sx={{
                            position: "absolute", 
                            top: 0, 
                            left: 0, 
                            right: 0,
                            bottom: 0,
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${process.env.PUBLIC_URL + "assets/img/discover.png"})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            //backgroundPositionX: "-12px",
                            backgroundPositionY: "0.1rem",
                            opacity: 0.8,
                            zIndex: -10,
                            borderRadius: 5, 
                        }}
                    >
                    </Box>
                    <Typography variant="h4" fontWeight={600} fontSize={28} color="orange">
                        Find your community on Discode
                    </Typography>
                    <Typography variant="caption" fontSize={16} paddingBottom={3}>
                        From gaming, to music, to learning, there's a place for you.
                    </Typography>
                    <SearchBar
                        placeholder={"Explore channels"}
                    />
                </Stack>
                <Stack border="1px solid red">
                    <Typography variant="h6">Featured Channels</Typography>
                    <Box marginTop={10}>Item</Box>
                    <Box marginTop={10}>Item</Box>
                    <Box marginTop={10}>Item</Box>
                    <Box marginTop={10}>Item</Box>
                    <Box marginTop={10}>Item</Box>
                </Stack>
            </Stack>
        </Box>
    )
}