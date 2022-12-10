import React from "react";
import { useState } from "react";
import { useStore } from "../../../../store/hooks";
import { Box, Button, Typography, IconButton } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { toast } from 'react-toastify';
import { handleCreateNewChannelAPI } from "../../../../services";
import { useNavigate } from "react-router-dom";

export default function ChannelCreator() {
    const [open, setOpen] = useState(false);
    const [start, setStart] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
        setStart(false);
    };

    const handleClose = (event, reason) => {
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
            >
                <DialogContent>
                    {
                        !start
                            ? <>
                                <Typography variant="h4" style={{ textAlign: "center" }}>Welcome to Channel creator:</Typography>
                                <br />
                                <Typography>Let's make your own community!</Typography>
                                [Image]
                            </>
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
    'Which purpose, type',
    'Which name, description',
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
            info.admin_id = state.user.id;

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
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <Step key={label} {...stepProps}>
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
