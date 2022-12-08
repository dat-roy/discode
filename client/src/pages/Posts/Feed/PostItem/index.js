import React from 'react';
import { useNavigate } from "react-router-dom"
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Chip, Avatar, Card, CardHeader } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import CardMedia from '@mui/material/CardMedia';
import { Stack } from '@mui/system';

export default function PostItem() {
    return (
        <Card
            sx={{
                width: 300, 
                marginBottom: 4, 
                borderRadius: 3,
                boxShadow: "4px 4px 11px rgba(33,33,33,.2)",
                "&:hover": {
                    cursor: "pointer", 
                    boxShadow: "4px 4px 11px rgba(33,33,33,.2)",
                }
            }}
        >
            <CardMedia
                component="img"
                height="280"
                image="https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-6/312561179_5153575181415769_1610658677941805954_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=Nid8_BgyTMgAX-FAaU3&_nc_ht=scontent.fhan14-1.fna&oh=00_AfD0EnRA90kSVLTvpplSQXR8KxvzDuFy0eQtdGtWwOiT6w&oe=639289FB"
                alt="post image"
            />
            <CardHeader
                avatar={
                    <Avatar src="" />
                }
                // action={
                // }
                title={
                    <Typography variant="subtitle1" sx={{ color: "NavajoWhite", fontWeight: 500 }}>
                        Title...
                    </Typography>
                }
                subheader={
                    <Stack
                        style={{
                            color: "lightgray",
                        }}
                        spacing={0.5}
                    >
                        <Typography
                            variant="subtitle2"
                        >
                            By @author
                        </Typography>
                        <Typography variant="caption">September 14, 2016</Typography>

                        <Stack direction={"row"} spacing={2}>
                            <Stack direction={"row"} spacing={0.3} alignItems={"center"}>
                                <FavoriteBorderIcon style={{ color: "pink", fontSize: 18 }} />
                                <Typography variant="caption">432</Typography>
                            </Stack>
                            <Stack direction={"row"} spacing={0.3} alignItems={"center"}>
                                <VisibilityOutlinedIcon style={{ color: "lightblue", fontSize: 18 }} />
                                <Typography variant="caption">10232123</Typography>
                            </Stack>
                            <Stack direction={"row"} spacing={0.3} alignItems={"center"}>
                                <ModeCommentOutlinedIcon style={{ color: "lightgreen", fontSize: 18 }} />
                                <Typography variant="caption">12</Typography>
                            </Stack>
                        </Stack>
                        <Stack direction={"row"} pt={0.5} justifyContent={"flex-start"}>
                            {['JavaScript', 'Java', 'DevOps'].map((label, index) => {
                                return <Chip
                                    key={index}
                                    label={label}
                                    style={{
                                        fontSize: 10,
                                        padding: 0,
                                        color: "inherit",
                                        borderRadius: 30,
                                        height: 20,
                                        backgroundColor: "#006983",
                                        marginRight: 6,
                                        marginTop: 0,
                                        marginLeft: 0,
                                    }}
                                />
                            })}
                        </Stack>
                    </Stack>
                }
                style={{
                    backgroundColor: "rgb(37 51 88)",
                    color: "lightgray",
                }}
            />
        </Card>
    )
}