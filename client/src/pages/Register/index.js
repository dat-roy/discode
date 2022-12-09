import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../../store/hooks";

import Box from '@mui/material/Box';
import { Stack, TextField, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { userActions } from "../../store/actions/userActions";
import PageNotFound from "../PageNotFound";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { toast } from "react-toastify";

const inputProps = {
    style: {
        color: "lightblue",
    }
}
const muiStyles = {
    '& .MuiInput-root:hover': {
        borderBottom: "none",
    },
    '& .MuiInput-underline:before': {
        borderBottom: '0.1px solid lightgray',
    },
    '& .MuiInput-underline:hover:before': {
        borderBottom: '0.1px solid lightblue',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'lightblue',
    },
}

export default function Register() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [, dispatch] = useStore();

    if (!location.state) {
        return <PageNotFound />
    }
    const { email } = location.state || null;
    const { credential } = location.state || null;

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            if (!data.get("gender")) {
                throw new Error("Please choose your gender!")
            }
            if (!data.get("username")) {
                throw new Error("Your username can not be empty!")
            }
            if (!data.get("password") || !data.get("confirmPassword")) {
                throw new Error("Please enter your new password!")
            }
            if (data.get("password") !== data.get("confirmPassword")) {
                throw new Error("The two passwords are not matched!")
            }
            setLoading(true);
            userActions.userRequestRegistration({
                email,
                credential,
                username: data.get("username"),
                password: data.get("password"),
                gender: data.get("gender"),
            })()
                .then(action => {
                    dispatch(action);
                    setTimeout(() => {
                        navigate("/login");
                    }, 1000);
                })
        } catch (err) {
            return toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Stack
            alignItems={"center"}
            justifyContent={"center"}
            width={"100%"} height={"100vh"}
        >
            <Stack width={"30%"} m={"auto"} textAlign={"center"} spacing={2} justifyContent={"space-between"}>
                <Stack>
                    <Typography variant="h5"
                        style={{
                            fontSize: 30,
                            fontWeight: 500,
                            color: "lightblue",
                        }}
                    >
                        Almost there!
                    </Typography>
                    <Typography variant="caption" style={{ fontSize: 16, }}>
                        Finish creating your account for the full experience.
                    </Typography>
                </Stack>

                <Stack
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    spacing={2}
                    //alignItems={"center"}
                    justifyContent={"center"}
                >
                    <Stack spacing={1}>
                        <Typography variant="caption" style={{ color: "gray" }}>Your email</Typography>
                        <Typography variant="body1" style={{ color: "lightgreen" }}>{email}</Typography>
                    </Stack>

                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                        <Typography variant="caption" style={{ color: "gray" }}>Gender:</Typography>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="gender"
                        >
                            <FormControlLabel value="female" control={
                                <Radio
                                    sx={{
                                        color: "lightblue",
                                        "&$checked": {
                                            color: "blue",
                                        }
                                    }}
                                />
                            } label="Female" />
                            <FormControlLabel value="male" control={
                                <Radio
                                    sx={{
                                        color: "lightblue",
                                        "&$checked": {
                                            color: "blue",
                                        }
                                    }}
                                />
                            } label="Male" />
                            <FormControlLabel value="other" control={
                                <Radio
                                    sx={{
                                        color: "lightblue",
                                        "&$checked": {
                                            color: "blue",
                                        }
                                    }}
                                />
                            } label="Other" />
                        </RadioGroup>
                    </Stack>

                    <Stack>
                        <Typography variant="caption" style={{ color: "gray" }}>Your username</Typography>
                        <TextField
                            margin="normal"
                            required
                            id="username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            variant="standard"
                            inputProps={inputProps}
                            sx={muiStyles}
                        />
                    </Stack>

                    <Stack>
                        <Typography variant="caption" style={{ color: "gray" }}>Your password</Typography>
                        <TextField
                            margin="normal"
                            required
                            name="password"
                            label="password"
                            type="password"
                            id="password"
                            variant="standard"
                            inputProps={inputProps}
                            InputLabelProps={{
                                style: { color: 'gray' },
                            }}
                            sx={muiStyles}
                        />

                        <TextField
                            margin="normal"
                            required
                            name="confirmPassword"
                            label="confirm password"
                            type="password"
                            id="confirmPassword"
                            variant="standard"
                            inputProps={inputProps}
                            InputLabelProps={{
                                style: { color: 'gray' },
                            }}
                            sx={muiStyles}
                        />
                    </Stack>

                    <Stack alignItems={"center"} pt={3}>
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            sx={{ width: "40%", m: "auto", borderRadius: 2 }}
                            loading={loading}
                            loadingIndicator="Loading…"
                        > Submit </LoadingButton>
                    </Stack>
                </Stack>
            </Stack>

            <Stack id={"footer"}
                style={{
                    position: "fixed",
                    bottom: 10,
                    color: "gray",
                }}
                className={"landingFooter"}
                width={"100%"}
                textAlign={"center"}
            >
                <Typography>Made with ❤️ by <Box
                    component={'a'}
                    href=""
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                    sx={{
                        textDecoration: "none",
                        "&:visited": {
                            color: "#7dffff",
                        },
                        "&:active": {
                            color: "#7dffff",
                        },
                        "&:hover": {
                            color: "#7dffff",
                        },
                    }}
                >
                    Group 1</Box>
                </Typography>
            </Stack>
        </Stack>
    )
}