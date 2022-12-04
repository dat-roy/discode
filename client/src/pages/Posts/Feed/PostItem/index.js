import React from 'react';
import { useNavigate } from "react-router-dom"
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Avatar, Card, CardHeader } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import CardMedia from '@mui/material/CardMedia';

export default function PostItem() {
    return (
        <Card sx={{ width: 300, marginBottom: 4, }}>
            <CardMedia
                component="img"
                height="200"
                image="https://scontent.fhan14-3.fna.fbcdn.net/v/t1.15752-9/316467812_3380284892298494_7535827253903707981_n.png?_nc_cat=103&ccb=1-7&_nc_sid=ae9488&_nc_ohc=vB15qGpgJhEAX9stIQm&_nc_ht=scontent.fhan14-3.fna&oh=03_AdSJXqkQXl4ZevK2Idep-TYo_NrjHmVMfttqnk8SmJm9Gw&oe=63B36244"
                alt="post image"
            />
            <CardHeader
                avatar={
                    <Avatar src=""/>
                }
                // action={
                // }
                title="Title title title title title title title title"
                subheader={
                    <>
                        <Typography>Author</Typography>
                        <Typography variant="caption">September 14, 2016</Typography>

                        <Box>
                            <FavoriteBorderIcon /> 50
                            <VisibilityOutlinedIcon /> 20
                            <ModeCommentOutlinedIcon /> 40
                        </Box>
                    </>
                }
            />
        </Card>
    )
}