import { Box, Button, Stack, TextField } from '@mui/material';
import React, { useRef, useState } from "react";

import { handleCheckChannelExistenceAPI } from "../../../../../services/";

export default function StepTwo(props) {
    const {
        steps,
        activeStep,
        handleBack,
        handleNext,
        info, setInfo,
        toast,
    } = props.commonProps;

    const titleRef = useRef();
    const descriptionRef = useRef();

    const [titleError, setTitleError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);

    const validateStep = () => {
        if (!titleRef.current.value) {
            return setTitleError("Channel name can not be empty")
        }

        if (!descriptionRef.current.value) {
            return setDescriptionError("Description can not be empty")
        }

        handleCheckChannelExistenceAPI(titleRef.current.value)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error(res?.message)
                }
                if (res.data?.exist) {
                    return setTitleError("This channel name has already existed")
                }
                setInfo({
                    ...info,
                    title: titleRef.current.value,
                    description: descriptionRef.current.value,
                })
                handleNext();
            })
            .catch(err => {
                return toast.error(err.message);
            })
    }

    return (
        <Stack alignItems={"center"}>
            <Stack spacing={2}>
                <TextField
                    required
                    inputRef={titleRef}
                    label="Channel name"
                    defaultValue={info?.title}
                    error={titleError ? true : false}
                    helperText={titleError ? titleError : null}
                    style={{
                        width: "500px"
                    }}
                    variant="filled"
                    inputProps={{
                        style: {
                            color: "lightblue",
                            fontSize: 30,
                            fontWeight: 500,
                            letterSpacing: 0.5,
                            lineHeight: 1,
                        }
                    }}
                    InputLabelProps={{
                        sx: {
                            color: "#073d73c9",
                        }
                    }}
                />
                <TextField
                    multiline
                    required
                    inputRef={descriptionRef}
                    maxRows={5}
                    minRows={5}
                    label="Description"
                    defaultValue={info?.description}
                    error={descriptionError ? true : false}
                    helperText={descriptionError ? descriptionError : null}
                    style={{
                        width: "500px"
                    }}
                    variant="filled"
                    inputProps={{
                        style: {
                            color: "lightblue",
                            letterSpacing: 0.5,
                            lineHeight: 1,
                        }
                    }}
                    InputLabelProps={{
                        sx: {
                            color: "#073d73c9",
                        }
                    }}
                />
            </Stack>
            <Stack direction="row" sx={{ pt: 2 }} spacing={1}>
                <Button
                    variant={"contained"}
                    disabled={activeStep === 0}
                    onClick={handleBack}
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
                    onClick={validateStep}
                    variant={"contained"}
                >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Stack>
        </Stack>
    )
}