import React from "react";
import { useRef, useState } from "react";
import { Box, Stack, Button, TextField } from '@mui/material';

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
        <>
            <TextField
                required
                inputRef={titleRef}
                label="Channel name"
                defaultValue={info?.title}
                error={titleError ? true : false}
                helperText={titleError ? titleError : null}
            />
            <TextField
                multiline
                inputRef={descriptionRef}
                maxRows={4}
                minRows={4}
                label="Description"
                defaultValue={info?.description}
                error={descriptionError ? true : false}
                helperText={descriptionError ? descriptionError : null}
                style={{
                    width: "400px"
                }}
            />
            <Stack direction="row" sx={{ pt: 2 }}>
                <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                >
                    Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />

                <Button onClick={validateStep}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Stack>
        </>
    )
}