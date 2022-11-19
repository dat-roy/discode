import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../../store/hooks";

import Box from '@mui/material/Box';
import { Button, TextField, Typography } from "@mui/material";
import { userActions } from "../../store/actions/userActions";
import PageNotFound from "../PageNotFound";

export default function Register() {
    const navigate = useNavigate();
    const location  = useLocation();
    const [loading, setLoading] = useState(false);
    const [state, dispatch] = useStore();
    
    if (! location.state) {
        return <PageNotFound />
    }
    const { email } = location.state || null;
    const { credential } = location.state || null;

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            
            //console.log(data.get("password") + " " +  data.get("confirmPassword"));

            if (data.get("password") === data.get("confirmPassword")) {
                setLoading(true);
                const [
                    action
                ] = await userActions.userRequestRegistration({
                        email: email,
                        username: data.get("username"),
                        password: data.get("password"),
                        //gender: data.get("gender"),
                        //birthday: data.get("birthday"),
                        credential: credential,
                    })();
                dispatch(action);
                navigate("/home");
            } else {
                console.log("PASSWORD DO NOT MATCH");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <Box>
            <Typography component="h1"  variant="h5">
                Sign in here
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                <TextField
                    margin="normal"
                    required
                    //fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={email}
                    disabled={true}
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    //fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                />

                <TextField
                    margin="normal"
                    required
                    //fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                />

                <TextField
                    margin="normal"
                    required
                    //fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                />

                <Button
                    type="submit"
                    //fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2}}
                > Submit </Button>
            </Box>

        </Box>
    )
} 