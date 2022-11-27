import React from "react";
import { Box, Stack, Button } from '@mui/material';

export default function StepOne(props) {
    const {
        steps,
        activeStep,
        handleBack,
        handleNext,
    } = props.commonProps;

    return (
        <>
            Which type?
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

                <Button onClick={handleNext}>
                    {activeStep === steps?.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Stack>
        </>
    )
}