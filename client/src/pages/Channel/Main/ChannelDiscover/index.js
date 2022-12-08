import { Box, Card, CardMedia, CardContent, Stack, Typography, Avatar, Grid } from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import SearchBar from "../../../../components/SearchBar"
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

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
                    textAlign="center"
                    alignItems={"center"}
                    justifyContent={"center"}
                    spacing={1.4}
                    position="relative"
                    id={"search-banner"}
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
                        autoFocus={true}
                        id={"search-bar"}
                    />
                </Stack>
                <Stack>
                    <Typography variant="h6" pt={2} pb={2}>Featured Channels</Typography>
                    <Grid
                        container
                        rowGap={1}
                        spacing={1.5}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((i, index) => {
                            return <Grid item>
                                <FeaturedChannelItem key={index} />
                            </Grid>
                        })}
                    </Grid>
                </Stack>
                <Stack alignItems={"center"} pt={2}>
                    <TravelExploreIcon style={{ fontSize: 28, color: "lightblue" }} />
                    <Typography variant={"body1"}>There are more communities out there!</Typography>
                    <Box
                        component={'a'}
                        href={`#search-banner`}
                        sx={{
                            textDecoration: "none",
                            "&:visited": {
                                color: "cyan",
                            },
                            "&:active": {
                                color: "cyan",
                            },
                            "&:hover": {
                                color: "#7dffff",
                            },
                        }}
                    >
                        <Typography variant="body2">Try searching for them</Typography>
                    </Box>
                </Stack>
            </Stack>
        </Box>
    )
}

function FeaturedChannelItem() {
    return (
        <Card
            sx={{
                width: 245,
                borderRadius: 2,
                bgcolor: "inherit",
                color: "inherit",
                "&:hover": {
                    cursor: "pointer",
                    boxShadow: "4px 4px 11px rgba(33,33,33,.2)",
                }
            }}
        >
            <CardMedia
                component="img"
                height={130}
                image={"https://kinhnghiemlaptrinh.com/wp-content/uploads/2019/09/image1-2-768x432.jpg"}
            />
            <Box
                key={"wrapper"}
                position={"relative"}
            >
                <Avatar
                    src={"https://fullstack.edu.vn/static/media/f8-icon.18cd71cfcfa33566a22b.png"}
                    key={"channel-logo"}
                    style={{
                        position: "absolute",
                        width: 50,
                        height: 50,
                        left: 0,
                        right: 0,
                        top: -35,
                        marginLeft: 16,
                        border: "4px solid rgba(19, 47, 76, 0.4)",
                        borderRadius: 15,
                    }}
                />
            </Box>
            <CardContent
                width="100%"
                sx={{
                    bgcolor: "rgba(19, 47, 76, 0.4)",
                    pl: 2.4, pr: 2.4,
                    pt: 5,
                    height: 100,
                }}
            >
                <Stack width={"100%"} height={"95%"}>
                    <Typography
                        variant={"subtitle2"}
                        fontWeight={600}
                        letterSpacing={1}
                        color={"yellow"}
                    >
                        FullstackOverflow
                    </Typography>
                    <Typography
                        variant={"caption"}
                        color={"lightgray"}
                    >
                        Description goes here
                    </Typography>
                </Stack>
                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                    spacing={0.7}
                    color={"lightgreen"}
                    width={"100%"}
                >
                    <PeopleIcon style={{ fontSize: 16 }} />
                    <Typography
                        variant={"caption"}
                    >
                        1,232,323 Members
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    )
}