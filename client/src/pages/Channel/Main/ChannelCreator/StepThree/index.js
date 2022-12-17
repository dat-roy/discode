import { Avatar, Box, Button, ButtonBase, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from "react";

const ImageType = Object.freeze({
    AVATAR: "avatar",
    BACKGROUND: "background",
})

const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
})

export default function StepThree(props) {
    const {
        steps,
        activeStep,
        handleBack,
        handleNext,
        info, setInfo,
        toast,
    } = props.commonProps;

    const [avatarBase64, setAvatarBase64] = useState(null);
    const [backgroundBase64, setBackgroundBase64] = useState(null);

    useEffect(() => {
        getBase64(info?.avatarFile)
            .then(res => {
                setAvatarBase64(res);
            })
            .catch(err => {
                //console.log(err);
            })
    }, [info?.avatarFile])

    useEffect(() => {
        getBase64(info?.backgroundFile)
            .then(res => {
                setBackgroundBase64(res);
            })
            .catch(err => {
                //console.log(err);
            })
    }, [info?.backgroundFile])

    const validateStep = () => {
        if (!info?.avatarFile) {
            return toast.error("Avatar can not be empty")
        }
        if (!info?.backgroundFile) {
            return toast.error("Background can not be empty")
        }
        handleNext();
    }

    const handleUploadClick = (event, type) => {
        let file = event.target.files[0];
        setInfo({
            ...info,
            ...(type === ImageType.AVATAR) ? { avatarFile: file } : { backgroundFile: file }
        })
    }

    return (
        <Stack alignItems={"center"} spacing={2}>
            <Stack alignItems={"center"} direction={"row"} spacing={2}>
                <AvatarInput />
                <BackgroundInput />
            </Stack>
            <Stack direction="row" sx={{ pt: 2 }} spacing={1}>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant={"contained"}
                    sx={{
                        mr: 1, bgcolor: "#ab5810",
                        "&:hover": {
                            bgcolor: "#f57f17"
                        }
                    }}
                >
                    Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />

                <Button
                    color='success'
                    onClick={validateStep}
                    variant={"contained"}
                >
                    {activeStep === steps?.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Stack>
        </Stack>
    )

    function AvatarInput() {
        return (
            <ButtonBase component="label"
                style={{
                    borderRadius: 50,
                }}
            >
                <input hidden accept="image/*" type="file"
                    onChange={(event) => handleUploadClick(event, ImageType.AVATAR)}
                />
                <Stack
                    alignItems={"center"}
                    justifyContent={"center"}
                    sx={{
                        height: 120,
                        width: 120,
                        borderRadius: 20,
                        border: "1px dotted lightgray",
                        textAlign: "center"
                    }}
                >
                    {
                        (info?.avatarFile && avatarBase64)
                            ? <Avatar
                                src={avatarBase64}
                                style={{
                                    height: 105,
                                    width: 105,
                                }}
                                alt="channel-avatar"
                            />
                            : <Typography>Upload an Image</Typography>
                    }
                </Stack>
            </ButtonBase>
        )
    }

    function BackgroundInput() {
        return (
            <ButtonBase component="label">
                <input hidden accept="image/*" type="file"
                    onChange={(event) => handleUploadClick(event, ImageType.BACKGROUND)}
                />
                <Stack
                    alignItems={"center"}
                    justifyContent={"center"}
                    sx={{
                        height: 200,
                        width: 500,
                        border: "1px dotted lightgray",
                        textAlign: "center"
                    }}
                >
                    {
                        (info?.backgroundFile && backgroundBase64)
                            ? <img
                                src={backgroundBase64}
                                style={{
                                    maxHeight: "100%",
                                    maxWidth: "100%",
                                    objectFit: "cover",
                                }}
                                alt="channel-background"
                            />
                            : <Typography>Upload an Image</Typography>
                    }
                </Stack>
            </ButtonBase>
        )
    }
}