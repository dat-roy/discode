import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { handleCreateNewChannelAPI } from "../../../../services";
import { useStore } from "../../../../store/hooks";
import StepOne from "./StepOne";
import StepThree from "./StepThree";
import StepTwo from "./StepTwo";

export default function ChannelCreator() {
    const [open, setOpen] = useState(false);
    const [start, setStart] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
        setStart(false);
    };

    const handleClose = (_, reason) => {
        if (reason && reason === "backdropClick") return;
        setOpen(false);
    };
    return (
        <>
            <IconButton
                size="large" color="inherit"
                style={{
                    marginRight: -10,
                }}
                onClick={handleClickOpen}
            >
                <AddCircleOutlineIcon sx={{ fontSize: 28 }} />
            </IconButton>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="md"
                className={"channelCreatorDialog"}
            >
                <DialogContent>
                    {
                        !start
                            ? <Stack alignItems={'center'}>
                                <Typography variant="h4" style={{ fontSize: 28, textAlign: "center" }}>Welcome to <span style={{ color: "lightblue" }}><b>Channel Creator</b></span>:</Typography>
                                <br />
                                <Typography variant='subtitle1' style={{color: "lightgray"}}>Here you can create your own communities!</Typography>
                                <Stack alignItems={"center"}>
                                    <Box component={"img"}
                                        src={"https://miro.medium.com/max/828/0*uin1w4zeb8DWs5Sa.webp"}
                                        width={"400px"}
                                        borderRadius={10}
                                        pt={5}
                                    />
                                </Stack>
                            </Stack>
                            : <>
                                <HorizontalLinearStepper />
                            </>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    {!start ? <Button onClick={() => { setStart(true) }} autoFocus>
                        Let's start
                    </Button> : null}
                </DialogActions>
            </Dialog>
        </>
    )
}

const steps = [
    'Choose type',
    'Choose name & description',
    'Upload image'
];

function HorizontalLinearStepper() {
    const [state,] = useStore();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [info, setInfo] = useState({
        title: '',
        description: '',
        type: '',
        avatarFile: null,
        backgroundFile: null,
    })

    const handleNext = () => {
        if (activeStep !== steps.length - 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            //Call API
            const { avatarFile, backgroundFile, ...document } = info;
            document.admin_id = state.user.id;

            const formData = new FormData();
            formData.append("document", JSON.stringify(document))
            if (avatarFile && backgroundFile) {
                formData.append("avatar", avatarFile)
                formData.append("background", backgroundFile)
            }
            handleCreateNewChannelAPI(formData)
                .then(res => {
                    if (res.status !== 200) {
                        throw new Error(res.message);
                    }
                    toast.success("Good job! Your channel has been created 😋")
                    setTimeout(() => {
                        navigate(`/channels/${res.data?.channel_id}`)
                    }, 2000)
                })
                .catch(err => {
                    return toast.error(err.message);
                })
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => {
                    const sx = {
                        // '& .MuiStepLabel-root .Mui-completed': {
                        //     color: 'secondary.white', // circle color (COMPLETED)
                        // },
                        '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                        {
                            color: "gray", // Just text label (COMPLETED)
                        },
                        // '& .MuiStepLabel-root .Mui-active': {
                        //     color: 'primary.main', // circle color (ACTIVE)
                        // },
                        '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                        {
                            color: 'common.white', // Just text label (ACTIVE)
                        },
                        '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                            fill: 'common', // circle's number (ACTIVE)
                        },
                        '& .MuiStepLabel-labelContainer': {
                            color: "gray",
                        },
                        '& .MuiSvgIcon-root .MuiStepIcon-root': {
                            color: "gray",
                            fill: "gray",
                        }
                    };
                    const labelProps = {};
                    return (
                        <Step key={index} sx={sx}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </>
            ) : (
                <>
                    <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                    {getStepComponent()}
                </>
            )}
        </Box>
    );

    function getStepComponent() {
        const commonProps = {
            steps, activeStep, handleBack, handleNext,
            info, setInfo,
            toast,
        }
        switch (activeStep) {
            case 0:
                return <StepOne
                    commonProps={commonProps}
                />
            case 1:
                return <StepTwo
                    commonProps={commonProps}
                />
            case 2:
                return <StepThree
                    commonProps={commonProps}
                />
            default:
                return null;
        }
    }
}
