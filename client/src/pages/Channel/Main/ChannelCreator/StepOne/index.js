import { Box, Button, Stack, Typography } from '@mui/material';
import React from "react";

export default function StepOne(props) {
    const {
        steps,
        activeStep,
        handleBack,
        handleNext,
    } = props.commonProps;

    return (
        <Stack alignItems={"center"} spacing={2}>
            <Typography variant="caption" align="center" fontStyle={"italic"}>
                Comming soon... (just click next)
            </Typography>
            <Stack direction="row" sx={{ pt: 2 }} spacing={1}>
                <Button
                    variant={"contained"}
                    // color="inherit"
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
                    variant={"contained"}
                    onClick={handleNext}
                >
                    {activeStep === steps?.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Stack>
        </Stack>
    )
}