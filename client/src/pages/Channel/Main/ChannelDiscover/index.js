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
                <Stack height="340px" border="1px solid red"
                    textAlign="center"
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <Typography variant="h5">
                        Find your community on Discode
                    </Typography>
                    <Typography variant="caption">
                        From gaming, to music, to learning, there's a place for you.
                    </Typography>
                    <SearchBar placeholder={"Explore channels"}/>
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